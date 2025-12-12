const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const helpers = require('./lib/helpers');
const telebase = require('./lib/telebase');
const { handleAntiFeatures, handleAntiRaid } = require('./lib/anti-features');
const { isOwnerOfThisBot, getOwnerPrefix, getOwnerMode, resolveOwnerNumber, canUseInSelfMode, getOwnerNumbers, getOwnerConfig, setOwnerConfig } = require('./lib/owner');
const antidelete = require('./commands/antidelete');

global.botStartTime = Date.now();
const commands = new Map();

let botPhoneNumber = null;
let ownerTelegramId = null;

const OWNER_USERNAME = process.env.OWNER_USERNAME || '@NightRaiders';

const loadCommands = () => {
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      const command = require(path.join(commandsPath, file));
      if (command.name) {
        commands.set(command.name.toLowerCase(), command);
        if (command.aliases) {
          command.aliases.forEach(alias => commands.set(alias.toLowerCase(), command));
        }
      }
    } catch (e) {
      console.error(`⚠️ Error loading command ${file}:`, e.message);
    }
  }

  console.log(`✅ Loaded ${commands.size} commands`);
};

const getOwnerJid = () => {
  const owners = getOwnerNumbers();
  if (owners.length > 0) {
    return owners[0] + '@s.whatsapp.net';
  }
  return null;
};

module.exports = (sock, phoneNumber = null, ownerChatId = null) => {
  botPhoneNumber = phoneNumber;
  ownerTelegramId = ownerChatId;
  console.log(`📱 Bot initialized for phone: ${phoneNumber || 'unknown'}, Owner: ${ownerChatId || 'unknown'}`);

  loadCommands();

  sock.ev.on('call', async (callData) => {
    const ownerNumber = botPhoneNumber ? resolveOwnerNumber(botPhoneNumber, null) : null;
    const ownerConfig = ownerNumber ? getOwnerConfig(ownerNumber) : {};
    
    if (ownerConfig?.anticall) {
      for (const call of callData) {
        if (call.status === 'offer') {
          await sock.rejectCall(call.id, call.from);
          
          if (!ownerConfig.callBlocks) ownerConfig.callBlocks = {};
          ownerConfig.callBlocks[call.from] = (ownerConfig.callBlocks[call.from] || 0) + 1;
          
          if (ownerConfig.callBlocks[call.from] >= 2) {
            await sock.updateBlockStatus(call.from, 'block');
            delete ownerConfig.callBlocks[call.from];
          }
          
          setOwnerConfig(ownerNumber, { callBlocks: ownerConfig.callBlocks });
        }
      }
    }
  });

  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
    try {
      if (action === 'add') {
        await handleAntiRaid(sock, id, participants, botPhoneNumber);
      }
    } catch (err) {
      console.error('⚠️ Error handling group participants update:', err);
    }
  });

  sock.ev.on('messages.update', async (updates) => {
    try {
      const ownerNumber = botPhoneNumber ? resolveOwnerNumber(botPhoneNumber, null) : null;
      const ownerConfig = ownerNumber ? getOwnerConfig(ownerNumber) : {};
      
      if (!ownerConfig?.antidelete) return;

      for (const update of updates) {
        if (update.update?.messageStubType === 1 || update.update?.message?.protocolMessage?.type === 0) {
          const ownerJid = ownerNumber ? ownerNumber + '@s.whatsapp.net' : getOwnerJid();
          if (ownerJid) {
            try {
              await antidelete.handleMessageRevocation(sock, update, ownerJid);
            } catch (e) {
              console.error('Error in antidelete handling:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error in messages.update handler:', err);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      try {
        if (!msg.message) continue;

        const chatId = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroupMsg = chatId.endsWith('@g.us');
        const isChannelMsg = chatId.endsWith('@newsletter');
        const isDMMsg = !isGroupMsg && !isChannelMsg;
        const groupId = isGroupMsg ? chatId : null;

        try {
          const antideleteConfig = antidelete.loadConfig();
          if (antideleteConfig?.enabled) {
            antidelete.handleIncomingMessage(msg);
          }
        } catch (e) {
          console.error('Error storing message for antidelete:', e);
        }

        const autoRead = helpers.loadDatabase('autoread.json');
        if (autoRead?.enabled) await sock.readMessages([msg.key]);

        const autoRecord = helpers.loadDatabase('autorecord.json');
        if (autoRecord?.enabled) await sock.sendPresenceUpdate('recording', chatId);

        const autoTyping = helpers.loadDatabase('autotyping.json');
        if (autoTyping?.enabled) await sock.sendPresenceUpdate('composing', chatId);

        let text = msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          msg.message.imageMessage?.caption ||
          msg.message.videoMessage?.caption || '';

        if (!text) continue;

        if (isGroupMsg) {
          const blocked = await handleAntiFeatures(sock, msg, sender, text, isGroupMsg, groupId, botPhoneNumber);
          if (blocked) continue;
        }

        let groupMetadata = null;
        if (isGroupMsg) {
          try {
            groupMetadata = await sock.groupMetadata(groupId);
          } catch (e) {
            console.warn('Failed to fetch group metadata:', e.message);
          }
        }

        let isOwner = false;
        
        if (botPhoneNumber) {
          isOwner = isOwnerOfThisBot(sender, botPhoneNumber);
          if (!isOwner) {
            const senderConfig = getOwnerConfig(resolveOwnerNumber(sender, groupMetadata));
            if (senderConfig && senderConfig.sudoUsers) {
              const botOwnerNumber = resolveOwnerNumber(botPhoneNumber, null);
              isOwner = senderConfig.sudoUsers.some(sudo => 
                resolveOwnerNumber(sudo, null) === botOwnerNumber
              );
            }
          }
          console.log(`🔐 Bot ${botPhoneNumber} - Sender: ${sender} - IsOwner: ${isOwner} - ChatType: ${isGroupMsg ? 'Group' : 'DM'}`);
        } else {
          isOwner = helpers.isOwner(sender, groupMetadata);
        }

        let prefix;

        if (botPhoneNumber) {
          const botOwnerNumber = resolveOwnerNumber(botPhoneNumber, null);
          prefix = getOwnerPrefix(botOwnerNumber) || helpers.getPrefix() || '.';
        } else {
          prefix = helpers.getPrefix() || '.';
        }

        if (!text.startsWith(prefix)) continue;

        if (!isOwner) {
          console.log(`🚫 Command blocked - not owner: ${sender}`);
          continue;
        }

        const args = text.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        const command = commands.get(commandName);
        if (!command) continue;

        const permissionCtx = {
          isOwner: helpers.isOwner(sender, groupMetadata),
          isSudo: helpers.isSudo(sender, groupMetadata),
          sender,
          groupMetadata
        };

        const isPremiumUser = ownerTelegramId ? telebase.isPremium(ownerTelegramId) : telebase.isPhonePremium(botPhoneNumber);
        const isOwnerTelegram = process.env.OWNER_TELEGRAM_ID && ownerTelegramId?.toString() === process.env.OWNER_TELEGRAM_ID;

        if (!isPremiumUser && !isOwnerTelegram) {
          console.log(`⛔ Premium check failed for bot ${botPhoneNumber}, Owner: ${ownerTelegramId}`);
          await sock.sendMessage(msg.key.remoteJid, {
            text: `╔═══════════════════════════════════════════╗
║ 👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀ⭒ ˣᴰ ⭒ 👿
╚═══════════════════════════════════════════╝

⛔ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ ⛔

ʏᴏᴜʀ ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴄᴇss ʜᴀs ᴇxᴘɪʀᴇᴅ ᴏʀ ɪs ɴᴏᴛ ᴀᴄᴛɪᴠᴇ.
ᴛʜɪs ʙᴏᴛ ɪs ғᴏʀ ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ᴄʟᴀɴ ᴍᴇᴍʙᴇʀs ᴏɴʟʏ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 ʏᴏᴜʀ ᴛᴇʟᴇɢʀᴀᴍ ɪᴅ: ${ownerTelegramId || 'ᴜɴᴋɴᴏᴡɴ'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ᴛᴏ ɢᴇᴛ ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴄᴇss:
1. ᴄᴏᴘʏ ʏᴏᴜʀ ᴛᴇʟᴇɢʀᴀᴍ ɪᴅ ᴀʙᴏᴠᴇ
2. sᴇɴᴅ ɪᴛ ᴛᴏ ᴛʜᴇ ᴏᴡɴᴇʀ: ${OWNER_USERNAME}
3. ᴡᴀɪᴛ ғᴏʀ ᴀᴘᴘʀᴏᴠᴀʟ

👿 "ᴏɴʟʏ ᴛʜᴇ ᴄʜᴏsᴇɴ ᴏɴᴇs sʜᴀʟʟ ᴡɪᴇʟᴅ ᴛʜɪs ᴘᴏᴡᴇʀ" 👿

╰────────────────────────────────────────╯`
          });
          continue;
        }

        if (command.groupOnly && !isGroupMsg) {
          await sock.sendMessage(chatId, { text: '❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs!' });
          continue;
        }

        console.log(`🔐 Executing ${commandName} - User: ${sender}, Owner: ${permissionCtx.isOwner}, Chat: ${isDMMsg ? 'DM' : isGroupMsg ? 'Group' : 'Channel'}`);

        try {
          await command.execute(sock, msg, args, {
            sender,
            chatId: msg.key.remoteJid,
            isGroupMsg,
            isDMMsg,
            isChannelMsg,
            groupId: isGroupMsg ? msg.key.remoteJid : null,
            isOwner: permissionCtx.isOwner,
            isSudo: permissionCtx.isSudo,
            botPhoneNumber,
            groupMetadata
          });
        } catch (cmdErr) {
          console.error(`❌ Error executing ${commandName}:`, cmdErr);
          await sock.sendMessage(msg.key.remoteJid, {
            text: `⚠️ ᴇʀʀᴏʀ ᴇxᴇᴄᴜᴛɪɴɢ ᴄᴏᴍᴍᴀɴᴅ: ${cmdErr.message}`
          });
        }

      } catch (err) {
        console.error('⚠️ Error handling message:', err);
      }
    }
  });

  console.log('👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs is now online and listening for commands! ☠️');
};

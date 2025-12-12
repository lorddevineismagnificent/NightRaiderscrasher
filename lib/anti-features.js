const helpers = require('./helpers');
const { getOwnerConfig, setOwnerConfig, resolveOwnerNumber, getOwnerNumbers } = require('./owner');

const issueWarning = async (sock, groupId, sender, reason, featureName, ownerNumber) => {
  const ownerConfig = ownerNumber ? getOwnerConfig(ownerNumber) : {};
  if (!ownerConfig.warnings) ownerConfig.warnings = {};
  if (!ownerConfig.warnings[groupId]) ownerConfig.warnings[groupId] = {};
  if (!ownerConfig.warnings[groupId][sender]) ownerConfig.warnings[groupId][sender] = { count: 0, reasons: [] };

  ownerConfig.warnings[groupId][sender].count++;
  ownerConfig.warnings[groupId][sender].reasons.push({ reason, feature: featureName, time: Date.now() });
  
  const warnings = ownerConfig.warnings[groupId][sender].count;
  if (ownerNumber) setOwnerConfig(ownerNumber, { warnings: ownerConfig.warnings });

  if (warnings >= 3) {
    await sock.sendMessage(groupId, { 
      text: `╔═══════════════════════════════════════════╗
║ ☠️ ғɪɴᴀʟ ᴊᴜᴅɢᴍᴇɴᴛ ☠️
╚═══════════════════════════════════════════╝

@${sender.split('@')[0]} ʏᴏᴜ'ᴠᴇ ᴠɪᴏʟᴀᴛᴇᴅ ᴛʜᴇ ʀᴜʟᴇs ${warnings} ᴛɪᴍᴇs!

💀 ʀᴇᴀsᴏɴ: ${reason}

⚡ "ᴛʜᴇ ᴡᴏʀʟᴅ sʜᴀʟʟ ᴋɴᴏᴡ ᴘᴀɪɴ" ⚡

╰────────────────────────────────────────╯`,
      mentions: [sender]
    });

    const isBotAdm = await helpers.isBotAdmin(sock, groupId);
    if (isBotAdm) {
      await sock.groupParticipantsUpdate(groupId, [sender], 'remove');
      delete ownerConfig.warnings[groupId][sender];
      if (ownerNumber) setOwnerConfig(ownerNumber, { warnings: ownerConfig.warnings });
    }
    return true;
  } else {
    await sock.sendMessage(groupId, { 
      text: `╔═══════════════════════════════════════════╗
║ ⚠️ ᴡᴀʀɴɪɴɢ ⚠️
╚═══════════════════════════════════════════╝

@${sender.split('@')[0]} ʏᴏᴜ ᴅᴀᴍɴ ғᴏᴏʟ!

🔴 ʀᴇᴀsᴏɴ: ${reason}
📊 ᴡᴀʀɴɪɴɢs: ${warnings}/3

☠️ "ᴏɴᴇ ᴍᴏʀᴇ ᴍɪsᴛᴀᴋᴇ ᴀɴᴅ ʏᴏᴜ'ʟʟ ʙᴇ ʙᴀɴɪsʜᴇᴅ" ☠️

╰────────────────────────────────────────╯`,
      mentions: [sender]
    });
    return false;
  }
};

const handleAntiFeatures = async (sock, msg, sender, text, isGroupMsg, groupId, botPhoneNumber = null) => {
  try {
    let groupMetadata = null;
    if (isGroupMsg) {
      try {
        groupMetadata = await sock.groupMetadata(groupId);
      } catch (e) {
        console.warn('Failed to fetch group metadata in anti-features:', e.message);
      }
    }
    
    const isOwner = helpers.isOwner(sender, groupMetadata);
    const isSudo = helpers.isSudo(sender, groupMetadata);
    
    if (isOwner || isSudo) return false;

    const ownerNumber = botPhoneNumber ? resolveOwnerNumber(botPhoneNumber, null) : null;
    const ownerConfig = ownerNumber ? getOwnerConfig(ownerNumber) : {};

    if (isGroupMsg) {
      const antibotGroups = ownerConfig.antibotGroups || [];
      if (antibotGroups.includes(groupId)) {
        if (!msg.key.fromMe) {
          const messageTypes = msg.message;
          const hasAdvancedFeatures = messageTypes?.buttonsMessage ||
                                      messageTypes?.listMessage ||
                                      messageTypes?.templateMessage;
          
          if (hasAdvancedFeatures) {
            await sock.sendMessage(groupId, { delete: msg.key });
            await sock.sendMessage(groupId, { 
              text: `╔═══════════════════════════════════════════╗
║ 🤖 ʙᴏᴛ ᴅᴇᴛᴇᴄᴛᴇᴅ 🤖
╚═══════════════════════════════════════════╝

@${sender.split('@')[0]} ɪs ᴜsɪɴɢ ᴀ ʙᴏᴛ!

💀 ɪɴsᴛᴀɴᴛ ʙᴀɴɪsʜᴍᴇɴᴛ! ɴᴏ ᴡᴀʀɴɪɴɢs! 💀

⚡ "ᴏɴʟʏ ɢᴏᴅs ᴄᴏɴᴛʀᴏʟ ʙᴏᴛs ʜᴇʀᴇ" ⚡

╰────────────────────────────────────────╯`,
              mentions: [sender]
            });
            
            const isBotAdm = await helpers.isBotAdmin(sock, groupId);
            if (isBotAdm) {
              await sock.groupParticipantsUpdate(groupId, [sender], 'remove');
            }
            return true;
          }
        }
      }

      const antilinkGroups = ownerConfig.antilinkGroups || [];
      if (antilinkGroups.includes(groupId)) {
        const captionText = text || 
                           msg.message?.imageMessage?.caption ||
                           msg.message?.videoMessage?.caption ||
                           msg.message?.documentMessage?.caption || '';
        const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|((chat\.whatsapp\.com|wa\.me)\/[^\s]+)/gi;
        if (linkRegex.test(captionText)) {
          await sock.sendMessage(groupId, { delete: msg.key });
          await issueWarning(sock, groupId, sender, 'ᴘᴏsᴛɪɴɢ ʟɪɴᴋs', 'antilink', ownerNumber);
          return true;
        }
      }

      const antispamGroups = ownerConfig.antispamGroups || [];
      if (antispamGroups.includes(groupId)) {
        const spamTracker = helpers.loadDatabase('spam-tracker.json') || {};
        if (!spamTracker[groupId]) spamTracker[groupId] = {};
        if (!spamTracker[groupId][sender]) spamTracker[groupId][sender] = { messages: [], identical: {} };
        
        const now = Date.now();
        
        const messageContent = (text || '').toLowerCase().trim();
        if (messageContent) {
          if (!spamTracker[groupId][sender].identical[messageContent]) {
            spamTracker[groupId][sender].identical[messageContent] = [];
          }
          
          spamTracker[groupId][sender].identical[messageContent] = 
            spamTracker[groupId][sender].identical[messageContent].filter(t => now - t < 300000);
          
          spamTracker[groupId][sender].identical[messageContent].push(now);
          
          if (spamTracker[groupId][sender].identical[messageContent].length >= 5) {
            await sock.sendMessage(groupId, { delete: msg.key });
            await sock.sendMessage(groupId, { 
              text: `╔═══════════════════════════════════════════╗
║ 🚨 sᴘᴀᴍ ᴅᴇᴛᴇᴄᴛᴇᴅ 🚨
╚═══════════════════════════════════════════╝

@${sender.split('@')[0]} ɪs sᴘᴀᴍᴍɪɴɢ!

💀 ɢʀᴏᴜᴘ ʟᴏᴄᴋᴇᴅ ғᴏʀ 5 ᴍɪɴᴜᴛᴇs! 💀

⚡ "ᴋɴᴏᴡ ᴘᴀɪɴ ᴛʜʀᴏᴜɢʜ sɪʟᴇɴᴄᴇ" ⚡

╰────────────────────────────────────────╯`,
              mentions: [sender]
            });

            const isBotAdm = await helpers.isBotAdmin(sock, groupId);
            if (isBotAdm) {
              await sock.groupParticipantsUpdate(groupId, [sender], 'remove');
              await sock.groupSettingUpdate(groupId, 'announcement');
              
              setTimeout(async () => {
                try {
                  await sock.groupSettingUpdate(groupId, 'not_announcement');
                  await sock.sendMessage(groupId, { 
                    text: `╔═══════════════════════════════════════════╗
║ 🔓 ɢʀᴏᴜᴘ ᴜɴʟᴏᴄᴋᴇᴅ 🔓
╚═══════════════════════════════════════════╝

💀 "ᴘᴇᴀᴄᴇ ʀᴇsᴛᴏʀᴇᴅ ᴛʜʀᴏᴜɢʜ ᴘᴀɪɴ" 💀

╰────────────────────────────────────────╯`
                  });
                } catch (e) {
                  console.error('Failed to unmute group:', e);
                }
              }, 300000);
            }
            
            delete spamTracker[groupId][sender];
            helpers.saveDatabase('spam-tracker.json', spamTracker);
            return true;
          }
        }
        
        spamTracker[groupId][sender].messages = 
          spamTracker[groupId][sender].messages.filter(t => now - t < 10000);
        spamTracker[groupId][sender].messages.push(now);
        
        if (spamTracker[groupId][sender].messages.length > 8) {
          await sock.sendMessage(groupId, { delete: msg.key });
          await issueWarning(sock, groupId, sender, 'ʀᴀᴘɪᴅ ᴍᴇssᴀɢɪɴɢ', 'antispam', ownerNumber);
          helpers.saveDatabase('spam-tracker.json', spamTracker);
          return true;
        }
        
        helpers.saveDatabase('spam-tracker.json', spamTracker);
      }
    } else {
      if (ownerConfig.antibug) {
        const ownerJid = ownerNumber ? ownerNumber + '@s.whatsapp.net' : null;
        
        const invisibleChars = /[\u200B-\u200D\uFEFF\u0000-\u001F\u2060-\u2069\u206A-\u206F\u180E\u17B4\u17B5\u2000-\u200F]/g;
        const hasInvisible = invisibleChars.test(text);
        
        if (hasInvisible) {
          if (ownerJid) {
            await sock.sendMessage(ownerJid, { 
              text: `╔═══════════════════════════════════════════╗
║ 🚨 ᴀɴᴛɪʙᴜɢ ᴀʟᴇʀᴛ 🚨
╚═══════════════════════════════════════════╝

💀 ɪɴᴠɪsɪʙʟᴇ ᴍᴇssᴀɢᴇ ᴅᴇᴛᴇᴄᴛᴇᴅ!

📱 sᴇɴᴅᴇʀ: +${sender.split('@')[0]}

⚠️ ᴛʜɪs ᴜsᴇʀ ʜᴀs ʙᴇᴇɴ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ʙʟᴏᴄᴋᴇᴅ!

☠️ "ᴛʜᴇ ᴘᴀɪɴ ʏᴏᴜ ᴅᴏɴ'ᴛ sᴇᴇ ɪs ᴛʜᴇ ᴍᴏsᴛ ᴅᴀɴɢᴇʀᴏᴜs" ☠️

╰────────────────────────────────────────╯`
            });
          }
          
          await sock.updateBlockStatus(sender, 'block');
          return true;
        }
        
        const messageTracker = helpers.loadDatabase('messageTracker.json') || {};
        if (!messageTracker.dm) messageTracker.dm = {};
        if (!messageTracker.dm[sender]) messageTracker.dm[sender] = { messages: [], content: {} };
        
        const now = Date.now();
        messageTracker.dm[sender].messages = messageTracker.dm[sender].messages.filter(t => now - t < 300000);
        messageTracker.dm[sender].messages.push(now);
        
        if (text) {
          const cleanText = (text || '').toLowerCase().trim();
          if (!messageTracker.dm[sender].content[cleanText]) {
            messageTracker.dm[sender].content[cleanText] = [];
          }
          messageTracker.dm[sender].content[cleanText] = 
            messageTracker.dm[sender].content[cleanText].filter(t => now - t < 300000);
          messageTracker.dm[sender].content[cleanText].push(now);
          
          if (messageTracker.dm[sender].content[cleanText].length >= 5) {
            if (ownerJid) {
              await sock.sendMessage(ownerJid, { 
                text: `╔═══════════════════════════════════════════╗
║ 🚨 sᴘᴀᴍ ᴀʟᴇʀᴛ 🚨
╚═══════════════════════════════════════════╝

💀 ᴠɪsɪʙʟᴇ sᴘᴀᴍ ᴅᴇᴛᴇᴄᴛᴇᴅ!

📱 sᴇɴᴅᴇʀ: +${sender.split('@')[0]}
📊 ɪᴅᴇɴᴛɪᴄᴀʟ ᴍᴇssᴀɢᴇs: ${messageTracker.dm[sender].content[cleanText].length}

⚠️ ᴀᴜᴛᴏ-ʙʟᴏᴄᴋᴇᴅ!

☠️ "sᴘᴀᴍᴍᴇʀs ᴡɪʟʟ ᴋɴᴏᴡ ᴇᴛᴇʀɴᴀʟ ᴘᴀɪɴ" ☠️

╰────────────────────────────────────────╯`
              });
            }
            
            await sock.updateBlockStatus(sender, 'block');
            
            delete messageTracker.dm[sender];
            helpers.saveDatabase('messageTracker.json', messageTracker);
            return true;
          }
        }
        
        if (messageTracker.dm[sender].messages.length > 15) {
          if (ownerJid) {
            await sock.sendMessage(ownerJid, { 
              text: `🚨 ʀᴀᴘɪᴅ sᴘᴀᴍ: +${sender.split('@')[0]} ʙʟᴏᴄᴋᴇᴅ!`
            });
          }
          
          await sock.updateBlockStatus(sender, 'block');
          delete messageTracker.dm[sender];
          helpers.saveDatabase('messageTracker.json', messageTracker);
          return true;
        }
        
        helpers.saveDatabase('messageTracker.json', messageTracker);
      }
    }

    return false;
  } catch (err) {
    console.error("⚠️ Error in handleAntiFeatures:", err);
    return false;
  }
};

const handleAntiRaid = async (sock, groupId, participants, botPhoneNumber = null) => {
  try {
    const ownerNumber = botPhoneNumber ? resolveOwnerNumber(botPhoneNumber, null) : null;
    const ownerConfig = ownerNumber ? getOwnerConfig(ownerNumber) : {};
    
    const antiraidGroups = ownerConfig.antiraidGroups || [];
    if (!antiraidGroups.includes(groupId)) return;

    const raidTracker = helpers.loadDatabase('raid-tracker.json') || {};
    if (!raidTracker[groupId]) raidTracker[groupId] = [];

    const now = Date.now();
    raidTracker[groupId] = raidTracker[groupId].filter(t => now - t.time < 60000);
    
    participants.forEach(participant => {
      raidTracker[groupId].push({ jid: participant, time: now });
    });

    const joinCount = raidTracker[groupId].length;
    const threshold = 5;

    if (joinCount >= threshold) {
      await sock.groupSettingUpdate(groupId, 'announcement');
      
      for (const entry of raidTracker[groupId]) {
        try {
          await sock.groupParticipantsUpdate(groupId, [entry.jid], 'remove');
        } catch (e) {
          console.error('Failed to remove raid participant:', e);
        }
      }

      await sock.sendMessage(groupId, { 
        text: `🚨 ʀᴀɪᴅ ᴅᴇᴛᴇᴄᴛᴇᴅ! ${joinCount} ᴜsᴇʀs ʀᴇᴍᴏᴠᴇᴅ. ɢʀᴏᴜᴘ ʟᴏᴄᴋᴇᴅ.`
      });

      raidTracker[groupId] = [];
      helpers.saveDatabase('raid-tracker.json', raidTracker);
    } else {
      helpers.saveDatabase('raid-tracker.json', raidTracker);
    }
  } catch (err) {
    console.error("⚠️ Error in handleAntiRaid:", err);
  }
};

module.exports = {
  handleAntiFeatures,
  handleAntiRaid
};

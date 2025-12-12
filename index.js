const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs-extra');
const path = require('path');
require("dotenv").config();

const startDevineBot = require("./devine");
const telebase = require('./lib/telebase');
const { addOwner, removeOwner, createOwnerConfig, removeOwnerConfig } = require('./lib/owner');

const activeBots = new Map();
global.botStartTime = Date.now();
global.activeAttacks = new Map();

const OWNER_TELEGRAM_ID = process.env.OWNER_TELEGRAM_ID || null;
const OWNER_USERNAME = process.env.OWNER_USERNAME || '@NightRaiders';

process.on('unhandledRejection', (reason, p) => {
  console.error('UNHANDLED REJECTION at:', p, 'reason:', reason);
});

let telegramBot;
if (process.env.TELEGRAM_BOT_TOKEN) {
  telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
  console.log("👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ᴛᴇʟᴇɢʀᴀᴍ ʙᴏᴛ ɪɴɪᴛɪᴀʟɪᴢᴇᴅ");
  
  telegramBot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    
    if (telebase.isBanned(chatId)) {
      return telegramBot.sendMessage(chatId, 
        `🚫 ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ʙᴀɴɪsʜᴇᴅ ғʀᴏᴍ ᴛʜᴇ ʀᴀɪᴅᴇʀs!\n\n👿 ᴄᴏɴᴛᴀᴄᴛ ${OWNER_USERNAME} ғᴏʀ ᴀᴘᴘᴇᴀʟ`
      );
    }
  });

  telegramBot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || 'unknown';
    const firstName = msg.from.first_name || 'User';
    
    telebase.saveUser(chatId, username, firstName);
    
    const isPremium = telebase.isPremium(chatId);
    const isOwnerUser = chatId.toString() === OWNER_TELEGRAM_ID;
    
    if (isOwnerUser) {
      const ownerMenuText = `╔═══════════════════════════════════════════╗
║ 👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀ⭒ ˣᴰ ⭒ 👿
║                                           
║ 👑 ᴡᴇʟᴄᴏᴍᴇ, ᴅᴇᴍᴏɴɪᴄ ʟᴏʀᴅ
╚═══════════════════════════════════════════╝

☠️ ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅs:
• /pair <number>
• /status
• /mybots
• /disconnect <number>
• /addprem <id> <days> 
• /delprem <id> 
• /stats 
• /broadcast <msg> 
• /allusers
• /ban <id> 
• /unban <id> 

👿 "ᴏɴʟʏ ᴛʜᴇ sᴛʀᴏɴɢ sᴜʀᴠɪᴠᴇ" 👿

╰────────────────────────────────────────╯`;

      const menuImagePath = path.join(__dirname, 'Assets', 'menu.jpg');
      const audioPath = path.join(__dirname, 'Assets', 'audio.mp3');
      
      try {
        if (fs.existsSync(menuImagePath)) {
          await telegramBot.sendPhoto(chatId, menuImagePath, { caption: ownerMenuText });
        } else {
          await telegramBot.sendMessage(chatId, ownerMenuText);
        }
        if (fs.existsSync(audioPath)) {
          await telegramBot.sendAudio(chatId, audioPath);
        }
      } catch (err) {
        console.error('Error sending owner menu:', err);
        telegramBot.sendMessage(chatId, ownerMenuText);
      }
      return;
    }
    
    if (!isPremium) {
      const nonPremiumText = `╔═══════════════════════════════════════════╗
║ 👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀ⭒ ˣᴰ ⭒ 👿
╚═══════════════════════════════════════════╝

⛔ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ ⛔

ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴀ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ.
ᴛʜɪs ʙᴏᴛ ɪs ғᴏʀ ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ᴄʟᴀɴ ᴍᴇᴍʙᴇʀs ᴏɴʟʏ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 ʏᴏᴜʀ ᴛᴇʟᴇɢʀᴀᴍ ɪᴅ: `${chatId}`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ᴛᴏ ɢᴇᴛ ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴄᴇss:
1. ᴄᴏᴘʏ ʏᴏᴜʀ ᴛᴇʟᴇɢʀᴀᴍ ɪᴅ ᴀʙᴏᴠᴇ
2. sᴇɴᴅ ɪᴛ ᴛᴏ ᴛʜᴇ ᴏᴡɴᴇʀ: ${OWNER_USERNAME}
3. ᴡᴀɪᴛ ғᴏʀ ᴀᴘᴘʀᴏᴠᴀʟ

👿 "ᴏɴʟʏ ᴛʜᴇ ᴄʜᴏsᴇɴ ᴏɴᴇs sʜᴀʟʟ ᴡɪᴇʟᴅ ᴛʜɪs ᴘᴏᴡᴇʀ" 👿

╰────────────────────────────────────────╯`;

      const premiumImagePath = path.join(__dirname, 'Assets', 'premium.jpg');
      
      try {
        if (fs.existsSync(premiumImagePath)) {
          await telegramBot.sendPhoto(chatId, premiumImagePath, { 
            caption: nonPremiumText,
            parse_mode: 'Markdown'
          });
        } else {
          await telegramBot.sendMessage(chatId, nonPremiumText);
        }
      } catch (err) {
        console.error('Error sending non-premium message:', err);
        telegramBot.sendMessage(chatId, nonPremiumText);
      }
      return;
    }
    
    const userBots = Array.from(activeBots.entries()).filter(([id]) => id.startsWith(`${chatId}_`));
    const premiumData = telebase.getPremiumData(chatId);
    const daysLeft = premiumData ? Math.ceil((premiumData.expiryDate - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
    
    const premiumMenuText = `╔═══════════════════════════════════════════╗
║ 👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀ⭒ ˣᴰ ⭒ 👿
╚═══════════════════════════════════════════╝

👤 ᴜsᴇʀ: ${firstName} 💎
🤖 ᴀᴄᴛɪᴠᴇ ʙᴏᴛs: ${userBots.length}/3
⏰ ᴘʀᴇᴍɪᴜᴍ ᴇxᴘɪʀᴇs: ${daysLeft} ᴅᴀʏs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☠️ ᴄᴏᴍᴍᴀɴᴅs:
• /pair <number> - ᴄᴏɴɴᴇᴄᴛ ᴡʜᴀᴛsᴀᴘᴘ
• /status - ᴄʜᴇᴄᴋ ʙᴏᴛ sᴛᴀᴛᴜs
• /mybots - ʏᴏᴜʀ ᴀᴄᴛɪᴠᴇ ʙᴏᴛs
• /disconnect <number> - ʀᴇᴍᴏᴠᴇ ʙᴏᴛ
• /premium - ᴘʀᴇᴍɪᴜᴍ ɪɴғᴏ

👿 "ᴛʜᴇ ᴅᴇᴍᴏɴɪᴄ ʀᴀɪᴅᴇʀs ʀɪsᴇ" 👿

╰────────────────────────────────────────╯`;

    const menuImagePath = path.join(__dirname, 'Assets', 'menu.jpg');
    const audioPath = path.join(__dirname, 'Assets', 'audio.mp3');
    
    try {
      if (fs.existsSync(menuImagePath)) {
        await telegramBot.sendPhoto(chatId, menuImagePath, { caption: premiumMenuText });
      } else {
        await telegramBot.sendMessage(chatId, premiumMenuText);
      }
      if (fs.existsSync(audioPath)) {
        await telegramBot.sendAudio(chatId, audioPath);
      }
    } catch (err) {
      console.error('Error sending premium menu:', err);
      telegramBot.sendMessage(chatId, premiumMenuText);
    }
  });

  telegramBot.onText(/\/pair (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const phoneNumber = match[1].trim().replace(/[^0-9]/g, '');
    
    const isPremium = telebase.isPremium(chatId);
    const isOwnerUser = chatId.toString() === OWNER_TELEGRAM_ID;
    
    if (!isPremium && !isOwnerUser) {
      return telegramBot.sendMessage(chatId, 
        `⛔ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ\n\n👿 ᴏɴʟʏ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀs ᴄᴀɴ ᴘᴀɪʀ ʙᴏᴛs.\n\n📱 ʏᴏᴜʀ ɪᴅ: ${chatId}\nᴄᴏɴᴛᴀᴄᴛ: ${OWNER_USERNAME}`
      );
    }
    
    if (!phoneNumber) {
      return telegramBot.sendMessage(chatId, 
        `⛔ ɪɴᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ ғᴏʀᴍᴀᴛ!\n\n👿 ᴜsᴇ: /pair 234xxxxxxxxxx`
      );
    }

    const userBots = Array.from(activeBots.entries()).filter(([id]) => id.startsWith(`${chatId}_`));
    const maxBots = isOwnerUser ? 10 : (isPremium ? 3 : 1);
    
    if (userBots.length >= maxBots) {
      return telegramBot.sendMessage(chatId, 
        `⛔ ʟɪᴍɪᴛ ʀᴇᴀᴄʜᴇᴅ (${maxBots} ʙᴏᴛs)!\n\n👿 ᴅɪsᴄᴏɴɴᴇᴄᴛ ᴀ ʙᴏᴛ ғɪʀsᴛ`
      );
    }

    const botId = `${chatId}_${phoneNumber}`;
    if (activeBots.has(botId)) {
      return telegramBot.sendMessage(chatId, 
        `⚠️ ʙᴏᴛ ᴀʟʀᴇᴀᴅʏ ᴇxɪsᴛs ғᴏʀ +${phoneNumber}!\n\n👿 ᴜsᴇ /status ᴛᴏ ᴄʜᴇᴄᴋ`
      );
    }

    telegramBot.sendMessage(chatId, 
      `⏳ sᴜᴍᴍᴏɴɪɴɢ ᴅᴇᴍᴏɴ ғᴏʀ: +${phoneNumber}\n\n👿 ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ...`
    );

    try {
      await startBotInstance(chatId, phoneNumber, botId);
      telebase.incrementUserBots(chatId);
    } catch (err) {
      console.error(`❌ Error starting bot for ${phoneNumber}:`, err);
      try { telegramBot.sendMessage(chatId, `⛔ ᴇʀʀᴏʀ sᴛᴀʀᴛɪɴɢ ʙᴏᴛ!\n\n👿 ${err.message}`); } catch(e){}
    }
  });

  telegramBot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const userBots = Array.from(activeBots.entries()).filter(([id]) => id.startsWith(`${chatId}_`));
    
    if (userBots.length === 0) {
      return telegramBot.sendMessage(chatId, 
        `⛔ ɴᴏ ᴀᴄᴛɪᴠᴇ ʙᴏᴛs!\n\n👿 ᴜsᴇ /pair ᴛᴏ sᴜᴍᴍᴏɴ ᴀ ᴅᴇᴍᴏɴ`
      );
    }

    let statusText = `╔═══════════════════════════════════════════╗
║ 👿 ʏᴏᴜʀ ᴅᴇᴍᴏɴs sᴛᴀᴛᴜs 👿
╚═══════════════════════════════════════════╝\n\n`;

    userBots.forEach(([id, bot]) => {
      const status = bot.connected ? '✅ ᴀᴄᴛɪᴠᴇ' : '⛔ ᴏғғʟɪɴᴇ';
      const uptime = getUptime(bot.startTime);
      statusText += `📱 +${bot.phoneNumber}\n`;
      statusText += `   sᴛᴀᴛᴜs: ${status}\n`;
      statusText += `   ᴜᴘᴛɪᴍᴇ: ${uptime}\n\n`;
    });

    statusText += `╰────────────────────────────────────────╯`;
    telegramBot.sendMessage(chatId, statusText);
  });

  telegramBot.onText(/\/mybots/, (msg) => {
    const chatId = msg.chat.id;
    const userBots = Array.from(activeBots.entries()).filter(([id]) => id.startsWith(`${chatId}_`));
    
    if (userBots.length === 0) {
      return telegramBot.sendMessage(chatId, 
        `⛔ ɴᴏ ᴀᴄᴛɪᴠᴇ ʙᴏᴛs!\n\n👿 ᴜsᴇ /pair ᴛᴏ sᴜᴍᴍᴏɴ`
      );
    }

    const isPremium = telebase.isPremium(chatId);
    const isOwnerUser = chatId.toString() === OWNER_TELEGRAM_ID;
    const maxBots = isOwnerUser ? 10 : (isPremium ? 3 : 1);

    let botsText = `╔═══════════════════════════════════════════╗
║ 👿 ʏᴏᴜʀ ᴅᴇᴍᴏɴs 👿
╚═══════════════════════════════════════════╝\n\n`;

    userBots.forEach(([id, bot], index) => {
      const status = bot.connected ? '✅' : '⛔';
      botsText += `${index + 1}. ${status} +${bot.phoneNumber}\n`;
    });

    botsText += `\n📊 ᴛᴏᴛᴀʟ: ${userBots.length}/${maxBots} ʙᴏᴛs\n`;
    botsText += `💎 ᴘʀᴇᴍɪᴜᴍ ʀᴀɪᴅᴇʀ\n`;
    botsText += `\n👿 /disconnect <number> ᴛᴏ ʙᴀɴɪsʜ\n`;
    botsText += `╰────────────────────────────────────────╯`;
    
    telegramBot.sendMessage(chatId, botsText);
  });

  telegramBot.onText(/\/disconnect (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const phoneNumber = match[1].trim().replace(/[^0-9]/g, '');
    
    const botId = `${chatId}_${phoneNumber}`;
    const bot = activeBots.get(botId);
    
    if (!bot) {
      return telegramBot.sendMessage(chatId, 
        `⛔ ɴᴏ ʙᴏᴛ ғᴏᴜɴᴅ ғᴏʀ +${phoneNumber}!\n\n👿 ᴜsᴇ /mybots`
      );
    }

    try {
      bot.sock.ev.removeAllListeners();
      bot.sock.end(undefined);
      activeBots.delete(botId);
      
      const authPath = path.join(__dirname, 'auth', botId);
      if (fs.existsSync(authPath)) {
        fs.removeSync(authPath);
      }
      
      removeOwner(phoneNumber);
      removeOwnerConfig(phoneNumber);
      
      telebase.decrementUserBots(chatId);
      
      telegramBot.sendMessage(chatId, 
        `✅ ᴅᴇᴍᴏɴ ʙᴀɴɪsʜᴇᴅ: +${phoneNumber}\n\n👿 "ᴛʜᴇ ᴄᴏɴɴᴇᴄᴛɪᴏɴ ɪs sᴇᴠᴇʀᴇᴅ" ☠️`
      );
    } catch (err) {
      console.error(`Error disconnecting bot ${botId}:`, err);
      try { telegramBot.sendMessage(chatId, `⛔ ᴇʀʀᴏʀ ᴅɪsᴄᴏɴɴᴇᴄᴛɪɴɢ!\n\n👿 ${err.message}`); } catch(e){}
    }
  });

  telegramBot.onText(/\/premium/, (msg) => {
    const chatId = msg.chat.id;
    const premiumData = telebase.getPremiumData(chatId);
    
    if (premiumData) {
      const daysLeft = Math.ceil((premiumData.expiryDate - Date.now()) / (1000 * 60 * 60 * 24));
      telegramBot.sendMessage(chatId, 
        `╔═══════════════════════════════════════════╗
║ 💎 ᴘʀᴇᴍɪᴜᴍ sᴛᴀᴛᴜs 💎
╚═══════════════════════════════════════════╝

✅ ᴀᴄᴛɪᴠᴇ
⏰ ᴇxᴘɪʀᴇs ɪɴ: ${daysLeft} ᴅᴀʏs
🤖 ᴍᴀx ʙᴏᴛs: 3

👿 ᴇɴᴊᴏʏ ʏᴏᴜʀ ᴘᴏᴡᴇʀ, ʀᴀɪᴅᴇʀ! ☠️

╰────────────────────────────────────────╯`
      );
    } else {
      telegramBot.sendMessage(chatId, 
        `╔═══════════════════════════════════════════╗
║ 👿 ᴘʀᴇᴍɪᴜᴍ ɪɴғᴏ 👿
╚═══════════════════════════════════════════╝

⛔ ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴘʀᴇᴍɪᴜᴍ

📱 ʏᴏᴜʀ ɪᴅ: ${chatId}
ᴄᴏɴᴛᴀᴄᴛ: ${OWNER_USERNAME}

👿 "ᴏɴʟʏ ᴛʜᴇ ᴄʜᴏsᴇɴ ᴏɴᴇs" ☠️

╰────────────────────────────────────────╯`
      );
    }
  });

  const isOwner = (chatId) => {
    return chatId.toString() === OWNER_TELEGRAM_ID;
  };

  telegramBot.onText(/\/addprem (\d+) (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    
    if (!isOwner(chatId)) {
      return telegramBot.sendMessage(chatId, '⛔ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!');
    }
    
    const targetId = match[1];
    const days = parseInt(match[2]);
    
    telebase.addPremium(targetId, days);
    
    telegramBot.sendMessage(chatId, 
      `✅ ᴘʀᴇᴍɪᴜᴍ ᴀᴅᴅᴇᴅ!\n\n👤 ᴜsᴇʀ: ${targetId}\n⏰ ᴅᴀʏs: ${days}\n\n👿 "ᴘᴏᴡᴇʀ ɢʀᴀɴᴛᴇᴅ" ☠️`
    );
    
    try {
      telegramBot.sendMessage(targetId, 
        `🎉 ᴄᴏɴɢʀᴀᴛᴜʟᴀᴛɪᴏɴs ʀᴀɪᴅᴇʀ!\n\n💎 ʏᴏᴜ ᴀʀᴇ ɴᴏᴡ ᴀ PREMIUM ᴜsᴇʀ ғᴏʀ ${days} ᴅᴀʏs!\n\n✨ ʙᴇɴᴇғɪᴛs:\n• 3 ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛs\n• ᴀᴄᴄᴇss ᴛᴏ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅs\n\nᴜsᴇ /start ᴛᴏ ʙᴇɢɪɴ\n\n👿 "ᴇᴍʙʀᴀᴄᴇ ᴛʜᴇ ᴅᴀʀᴋɴᴇss" ☠️`
      );
    } catch (err) {
      console.log('Could not notify user');
    }
  });

  telegramBot.onText(/\/delprem (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    
    if (!isOwner(chatId)) {
      return telegramBot.sendMessage(chatId, '⛔ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!');
    }
    
    const targetId = match[1];
    telebase.removePremium(targetId);
    
    telegramBot.sendMessage(chatId, 
      `✅ ᴘʀᴇᴍɪᴜᴍ ʀᴇᴍᴏᴠᴇᴅ!\n\n👤 ᴜsᴇʀ: ${targetId}\n\n👿 "ᴘᴏᴡᴇʀ ʀᴇᴠᴏᴋᴇᴅ" ☠️`
    );
  });

  telegramBot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    
    if (!isOwner(chatId)) {
      return telegramBot.sendMessage(chatId, '⛔ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!');
    }
    
    const stats = telebase.getStats();
    const activeBotCount = activeBots.size;
    const uptime = getUptime(global.botStartTime);
    
    const statsText = `╔═══════════════════════════════════════════╗
║ 📊 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs sᴛᴀᴛs 📊
╚═══════════════════════════════════════════╝

👥 ᴛᴏᴛᴀʟ ᴜsᴇʀs: ${stats.totalUsers}
🤖 ᴀᴄᴛɪᴠᴇ ʙᴏᴛs: ${activeBotCount}
💎 ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀs: ${stats.premiumUsers}
🚫 ʙᴀɴɴᴇᴅ ᴜsᴇʀs: ${stats.bannedUsers}
⏰ ᴜᴘᴛɪᴍᴇ: ${uptime}

👿 "ᴛʜᴇ ʀᴀɪᴅᴇʀs ɢʀᴏᴡ sᴛʀᴏɴɢᴇʀ" ☠️

╰────────────────────────────────────────╯`;
    
    telegramBot.sendMessage(chatId, statsText);
  });

  telegramBot.onText(/\/broadcast (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    
    if (!isOwner(chatId)) {
      return telegramBot.sendMessage(chatId, '⛔ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!');
    }
    
    const message = match[1];
    const users = telebase.getAllUsers();
    
    let sent = 0;
    let failed = 0;
    
    telegramBot.sendMessage(chatId, `📢 ʙʀᴏᴀᴅᴄᴀsᴛɪɴɢ ᴛᴏ ${users.length} ʀᴀɪᴅᴇʀs...`);
    
    for (const userId of users) {
      try {
        await telegramBot.sendMessage(userId, `📢 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ʙʀᴏᴀᴅᴄᴀsᴛ:\n\n${message}\n\n👿 - ɴɪɢʜᴛ ʀᴀɪᴅᴇʀ⭒ ˣᴰ ⭒`);
        sent++;
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (err) {
        failed++;
      }
    }
    
    telegramBot.sendMessage(chatId, 
      `✅ ʙʀᴏᴀᴅᴄᴀsᴛ ᴄᴏᴍᴘʟᴇᴛᴇ!\n\n✅ sᴇɴᴛ: ${sent}\n⛔ ғᴀɪʟᴇᴅ: ${failed}`
    );
  });

  telegramBot.onText(/\/allusers/, (msg) => {
    const chatId = msg.chat.id;
    
    if (!isOwner(chatId)) {
      return telegramBot.sendMessage(chatId, '⛔ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!');
    }
    
    const usersData = telebase.getAllUsersData();
    
    if (usersData.length === 0) {
      return telegramBot.sendMessage(chatId, '⛔ ɴᴏ ᴜsᴇʀs ʏᴇᴛ!');
    }
    
    let usersText = `╔═══════════════════════════════════════════╗
║ 👥 ᴀʟʟ ʀᴀɪᴅᴇʀs 👥
╚═══════════════════════════════════════════╝\n\n`;

    usersData.slice(0, 20).forEach((user, index) => {
      const premium = telebase.isPremium(user.chatId) ? '💎' : '';
      usersText += `${index + 1}. ${user.firstName} ${premium}\n`;
      usersText += `   ID: ${user.chatId}\n`;
      usersText += `   @${user.username}\n`;
      usersText += `   ʙᴏᴛs: ${user.activeBots}\n\n`;
    });

    if (usersData.length > 20) {
      usersText += `\n... ᴀɴᴅ ${usersData.length - 20} ᴍᴏʀᴇ ʀᴀɪᴅᴇʀs\n`;
    }

    usersText += `\n📊 ᴛᴏᴛᴀʟ: ${usersData.length} ʀᴀɪᴅᴇʀs\n`;
    usersText += `╰────────────────────────────────────────╯`;
    
    telegramBot.sendMessage(chatId, usersText);
  });

  telegramBot.onText(/\/ban (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    
    if (!isOwner(chatId)) {
      return telegramBot.sendMessage(chatId, '⛔ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!');
    }
    
    const targetId = match[1];
    
    if (targetId === OWNER_TELEGRAM_ID) {
      return telegramBot.sendMessage(chatId, '⛔ ᴄᴀɴɴᴏᴛ ʙᴀɴ ᴛʜᴇ ᴏᴡɴᴇʀ!');
    }
    
    telebase.banUser(targetId);
    
    const userBots = Array.from(activeBots.entries()).filter(([id]) => id.startsWith(`${targetId}_`));
    userBots.forEach(([botId, bot]) => {
      bot.sock.ev.removeAllListeners();
      bot.sock.end(undefined);
      activeBots.delete(botId);
    });
    
    telegramBot.sendMessage(chatId, 
      `🚫 ᴜsᴇʀ ʙᴀɴɪsʜᴇᴅ!\n\n👤 ID: ${targetId}\n🤖 ʙᴏᴛs ᴅᴇsᴛʀᴏʏᴇᴅ: ${userBots.length}\n\n👿 "ʙᴀɴɪsʜᴇᴅ ғʀᴏᴍ ᴛʜᴇ ʀᴀɪᴅᴇʀs" ☠️`
    );
    
    try {
      telegramBot.sendMessage(targetId, 
        `🚫 ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ʙᴀɴɪsʜᴇᴅ!\n\n👿 ᴄᴏɴᴛᴀᴄᴛ ${OWNER_USERNAME} ғᴏʀ ᴀᴘᴘᴇᴀʟ`
      );
    } catch (err) {
      console.log('Could not notify banned user');
    }
  });

  telegramBot.onText(/\/unban (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    
    if (!isOwner(chatId)) {
      return telegramBot.sendMessage(chatId, '⛔ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ!');
    }
    
    const targetId = match[1];
    telebase.unbanUser(targetId);
    
    telegramBot.sendMessage(chatId, 
      `✅ ᴜsᴇʀ ᴜɴʙᴀɴɴᴇᴅ!\n\n👤 ID: ${targetId}\n\n👿 "ʀᴇᴅᴇᴍᴘᴛɪᴏɴ ɢʀᴀɴᴛᴇᴅ" ☠️`
    );
    
    try {
      telegramBot.sendMessage(targetId, 
        `✅ ʏᴏᴜ ʜᴀᴠᴇ ʙᴇᴇɴ ᴜɴʙᴀɴɴᴇᴅ!\n\n👿 ᴡᴇʟᴄᴏᴍᴇ ʙᴀᴄᴋ ᴛᴏ ᴛʜᴇ ʀᴀɪᴅᴇʀs!\n\nᴜsᴇ /start ᴛᴏ ʙᴇɢɪɴ`
      );
    } catch (err) {
      console.log('Could not notify unbanned user');
    }
  });

  telegramBot.onText(/\/raidreport(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const target = match[1] ? match[1].trim() : null;
    
    const isPremium = telebase.isPremium(chatId);
    const isOwnerUser = chatId.toString() === OWNER_TELEGRAM_ID;
    
    if (!isPremium && !isOwnerUser) {
      return telegramBot.sendMessage(chatId, 
        `⛔ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ\n\n👿 ᴏɴʟʏ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀs ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.\n\n📱 ʏᴏᴜʀ ɪᴅ: ${chatId}\nᴄᴏɴᴛᴀᴄᴛ: ${OWNER_USERNAME}`
      );
    }
    
    try {
      const raidreportCmd = require('./commands/raidreport');
      await raidreportCmd.telegramExecute(telegramBot, chatId, target);
    } catch (err) {
      console.error('Raidreport error:', err);
      telegramBot.sendMessage(chatId, `⛔ ᴇʀʀᴏʀ: ${err.message}`);
    }
  });

} else {
  console.log("⚠️ TELEGRAM_BOT_TOKEN not found in .env - Telegram bridge disabled");
}

function getUptime(startTime) {
  const uptime = (Date.now() - startTime) / 1000;
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

async function startBotInstance(chatId, phoneNumber, botId) {
  const authPath = path.join(__dirname, 'auth', botId);
  await fs.ensureDir(authPath);

  const credsFilePath = path.join(authPath, 'creds.json');

  const { state, saveCreds } = await useMultiFileAuthState(authPath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: require("pino")({ level: process.env.DEBUG === 'true' ? "debug" : "silent" }),
    syncFullHistory: false,
    markOnlineOnConnect: true,
    keepAliveIntervalMs: 30000,
    retryRequestDelayMs: 250,
    getMessage: async (key) => {
      return { conversation: "" };
    }
  });

  const botInstance = {
    sock,
    phoneNumber,
    chatId,
    connected: false,
    startTime: Date.now(),
    devineInitialized: false,
    pairingCodeSent: false,
    paired: false
  };

  activeBots.set(botId, botInstance);

  try {
    if (fs.existsSync(credsFilePath)) {
      const raw = fs.readFileSync(credsFilePath, 'utf8') || '{}';
      const parsed = JSON.parse(raw);
      if (parsed?.me) {
        botInstance.paired = true;
        console.log(`ℹ️ Found existing creds for ${botId}`);
      }
    }
  } catch (err) {
    console.warn('Could not read creds file pre-check:', err);
  }

  sock.ev.on("creds.update", async (creds) => {
    try {
      await saveCreds(creds);
    } catch (e) {
      console.error('Error saving creds:', e);
    }
    if (creds?.me) {
      botInstance.paired = true;
      console.log(`✅ Creds saved for ${botId}.`);
      
      try {
        const added = addOwner(phoneNumber);
        if (added) {
          console.log(`✅ Auto-added ${phoneNumber} to owner.json`);
        }
        createOwnerConfig(phoneNumber);
        console.log(`✅ Created config for owner ${phoneNumber}`);
      } catch (e) {
        console.error('Failed to auto-add owner:', e);
      }
    }
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log(`✅ Connection established for ${phoneNumber} (User: ${chatId})`);
      botInstance.connected = true;
      
      telebase.mapPhoneToOwner(phoneNumber, chatId);
      console.log(`📍 Mapped ${phoneNumber} -> Telegram ID ${chatId}`);
      
      try {
        const userJid = sock.user?.id;
        if (userJid && userJid.includes('@lid')) {
          const lidNumber = userJid.split('@')[0];
          const mappingDir = path.join(__dirname, 'auth', botId);
          await fs.ensureDir(mappingDir);
          
          const reverseMappingFile = path.join(mappingDir, `lid-mapping-${lidNumber}_reverse.json`);
          fs.writeFileSync(reverseMappingFile, JSON.stringify(phoneNumber));
          console.log(`✅ Created LID mapping: ${lidNumber} -> ${phoneNumber}`);
        }
      } catch (err) {
        console.error('Error creating LID mapping:', err);
      }
      
      if (telegramBot) {
        try { await telegramBot.sendMessage(chatId, `✅ ᴅᴇᴍᴏɴ sᴜᴍᴍᴏɴᴇᴅ!\n\n👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀ ɪs ɴᴏᴡ ᴏɴʟɪɴᴇ ғᴏʀ +${phoneNumber}! ☠️`); } catch(e){}
      }
      
      if (!botInstance.devineInitialized) {
        console.log(`👿 Starting ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs for ${phoneNumber}... ☠️`);
        startDevineBot(sock, phoneNumber, chatId);
        botInstance.devineInitialized = true;
      }
    }

    if (connection === "close") {
      botInstance.connected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const isLoggedOut = statusCode === DisconnectReason.loggedOut;

      console.log(`❌ Connection closed for ${phoneNumber}. statusCode: ${statusCode}`);

      if (!isLoggedOut) {
        if (Number(statusCode) === 515) {
          console.log(`🔄 Stream error (515) for ${phoneNumber} — retrying...`);
        }

        try {
          sock.ev.removeAllListeners();
          sock.end();
        } catch (e) {
          console.error('Error closing socket:', e);
        }

        const reconnectDelay = Number(statusCode) === 515 ? 10000 : 3000;
        setTimeout(async () => {
          activeBots.delete(botId);
          try {
            await startBotInstance(chatId, phoneNumber, botId);
          } catch (err) {
            console.error(`❌ Failed to restart bot for ${phoneNumber}:`, err);
          }
        }, reconnectDelay);

      } else {
        console.log(`⚠️ ${phoneNumber} logged out manually.`);
        activeBots.delete(botId);
        
        try {
          const removed = removeOwner(phoneNumber);
          if (removed) {
            console.log(`✅ Auto-removed ${phoneNumber} from owner.json`);
          }
          removeOwnerConfig(phoneNumber);
        } catch (e) {
          console.error('Failed to auto-remove owner:', e);
        }

        if (telegramBot) {
          try { await telegramBot.sendMessage(chatId, `⛔ ʏᴏᴜʀ ᴅᴇᴍᴏɴ ғᴏʀ +${phoneNumber} ᴡᴀs ᴅᴇsᴛʀᴏʏᴇᴅ!\n\n👿 ᴜsᴇ /pair ᴛᴏ sᴜᴍᴍᴏɴ ᴀɢᴀɪɴ`); } catch(e){}
        }

        try {
          if (fs.existsSync(authPath)) {
            fs.removeSync(authPath);
            console.log(`✅ Removed auth folder for ${botId}`);
          }
        } catch (err) {
          console.error(`❌ Failed to remove auth folder:`, err);
        }
      }
    }
  });

  if (!botInstance.paired && !botInstance.pairingCodeSent && phoneNumber) {
    botInstance.pairingCodeSent = true;
    setTimeout(async () => {
      if (!sock.authState?.creds?.me && !botInstance.paired) {
        try {
          const code = await sock.requestPairingCode(phoneNumber);
          if (telegramBot) {
            await telegramBot.sendMessage(chatId,
              `╔═══════════════════════════════════════════╗
║ 👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀ ᴘᴀɪʀɪɴɢ 👿
╚═══════════════════════════════════════════╝

🔢 ʏᴏᴜʀ ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ: `${code}`

📱 ɪɴsᴛʀᴜᴄᴛɪᴏɴs:
1. ᴏᴘᴇɴ ᴡʜᴀᴛsᴀᴘᴘ
2. ɢᴏ ᴛᴏ sᴇᴛᴛɪɴɢs > ʟɪɴᴋᴇᴅ ᴅᴇᴠɪᴄᴇs
3. ᴛᴀᴘ "ʟɪɴᴋ ᴀ ᴅᴇᴠɪᴄᴇ"
4. ᴛᴀᴘ "ʟɪɴᴋ ᴡɪᴛʜ ᴘʜᴏɴᴇ ɴᴜᴍʙᴇʀ"
5. ᴇɴᴛᴇʀ ᴛʜᴇ ᴄᴏᴅᴇ ᴀʙᴏᴠᴇ

⏰ ᴄᴏᴅᴇ ᴇxᴘɪʀᴇs ɪɴ 60 sᴇᴄᴏɴᴅs

👿 "ᴛʜᴇ ᴅᴇᴍᴏɴ ᴀᴡᴀɪᴛs" ☠️

╰────────────────────────────────────────╯`
            );
          }
          console.log(`📲 Pairing code for ${phoneNumber}: ${code}`);
        } catch (err) {
          console.error(`❌ Failed to request pairing code for ${phoneNumber}:`, err);
          if (telegramBot) {
            try { await telegramBot.sendMessage(chatId, `⛔ ғᴀɪʟᴇᴅ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ ᴘᴀɪʀɪɴɢ ᴄᴏᴅᴇ!\n\n👿 ${err.message}\n\nᴛʀʏ ᴀɢᴀɪɴ ᴡɪᴛʜ /pair`); } catch(e){}
          }
        }
      }
    }, 3000);
  }
}

async function restoreExistingSessions() {
  const authDir = path.join(__dirname, 'auth');
  
  if (!fs.existsSync(authDir)) {
    console.log('📂 No auth directory found, starting fresh');
    return;
  }

  const sessionFolders = fs.readdirSync(authDir);
  console.log(`📂 Found ${sessionFolders.length} session folders to restore`);

  for (const folder of sessionFolders) {
    const credsPath = path.join(authDir, folder, 'creds.json');
    
    if (fs.existsSync(credsPath)) {
      try {
        const parts = folder.split('_');
        if (parts.length >= 2) {
          const chatId = parts[0];
          const phoneNumber = parts.slice(1).join('_');
          const botId = folder;

          if (!activeBots.has(botId)) {
            console.log(`🔄 Restoring session for ${phoneNumber} (${chatId})`);
            await startBotInstance(chatId, phoneNumber, botId);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      } catch (err) {
        console.error(`❌ Failed to restore session ${folder}:`, err);
      }
    }
  }
}

restoreExistingSessions().then(() => {
  console.log('👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ʙᴏᴛ ᴍᴀɴᴀɢᴇʀ sᴛᴀʀᴛᴇᴅ! ☠️');
});

module.exports = { activeBots, telegramBot, getUptime };

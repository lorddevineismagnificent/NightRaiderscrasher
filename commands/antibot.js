const { setOwnerConfig, getOwnerConfig, resolveOwnerNumber } = require('../lib/owner');

module.exports = {
  name: 'antibot',
  aliases: ['nobot', 'botshield'],
  description: '🤖 ᴅᴇᴛᴇᴄᴛ ᴀɴᴅ ᴋɪᴄᴋ ᴏᴛʜᴇʀ ʙᴏᴛs ɪɴsᴛᴀɴᴛʟʏ',
  ownerOnly: true,
  groupOnly: true,

  async execute(sock, msg, args, { sender, groupId, botPhoneNumber, groupMetadata }) {
    try {
      const ownerNumber = botPhoneNumber ? resolveOwnerNumber(botPhoneNumber, null) : resolveOwnerNumber(sender, groupMetadata);
      const ownerConfig = getOwnerConfig(ownerNumber);
      
      if (!ownerConfig.antibotGroups) ownerConfig.antibotGroups = [];

      if (!args[0] || !['on', 'off', 'status'].includes(args[0].toLowerCase())) {
        return await sock.sendMessage(groupId, { 
          text: `╔═══════════════════════════════════════════╗
║ 🤖 ᴀɴᴛɪʙᴏᴛ - ʙᴏᴛ ᴋɪʟʟᴇʀ 🤖
╚═══════════════════════════════════════════╝

⛔ ɪɴᴠᴀʟɪᴅ ᴏᴘᴛɪᴏɴ!

📝 ᴜsᴀɢᴇ:
• .ᴀɴᴛɪʙᴏᴛ ᴏɴ - ᴇɴᴀʙʟᴇ ʙᴏᴛ ᴋɪʟʟᴇʀ
• .ᴀɴᴛɪʙᴏᴛ ᴏғғ - ᴅɪsᴀʙʟᴇ ʙᴏᴛ ᴋɪʟʟᴇʀ
• .ᴀɴᴛɪʙᴏᴛ sᴛᴀᴛᴜs - ᴄʜᴇᴄᴋ sᴛᴀᴛᴜs

⚠️ ᴏᴛʜᴇʀ ʙᴏᴛs ᴡɪʟʟ ʙᴇ ᴋɪᴄᴋᴇᴅ ɪɴsᴛᴀɴᴛʟʏ!

👿 "ᴏɴʟʏ ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ʀᴜʟᴇ ʜᴇʀᴇ" ☠️
╰────────────────────────────────────────╯` 
        });
      }

      const action = args[0].toLowerCase();
      const isEnabled = ownerConfig.antibotGroups.includes(groupId);
      
      if (action === 'status') {
        const status = isEnabled ? '✅ ᴇɴᴀʙʟᴇᴅ' : '⛔ ᴅɪsᴀʙʟᴇᴅ';
        return await sock.sendMessage(groupId, { 
          text: `╔═══════════════════════════════════════════╗
║ 🤖 ᴀɴᴛɪʙᴏᴛ sᴛᴀᴛᴜs 🤖
╚═══════════════════════════════════════════╝

📊 sᴛᴀᴛᴜs: ${status}

👿 "ᴏɴʟʏ ᴅᴇᴍᴏɴs ᴄᴏɴᴛʀᴏʟ ʙᴏᴛs ʜᴇʀᴇ" ☠️
╰────────────────────────────────────────╯` 
        });
      }
      
      if (action === 'on') {
        if (!isEnabled) {
          ownerConfig.antibotGroups.push(groupId);
        }
        setOwnerConfig(ownerNumber, { antibotGroups: ownerConfig.antibotGroups });
        await sock.sendMessage(groupId, { 
          text: `╔═══════════════════════════════════════════╗
║ 🤖 ᴀɴᴛɪʙᴏᴛ ᴇɴᴀʙʟᴇᴅ 🤖
╚═══════════════════════════════════════════╝

✅ ʙᴏᴛ ᴋɪʟʟᴇʀ ᴀᴄᴛɪᴠᴀᴛᴇᴅ!

⚡ ᴏᴛʜᴇʀ ʙᴏᴛs ᴡɪʟʟ ʙᴇ ᴋɪᴄᴋᴇᴅ ɪɴsᴛᴀɴᴛʟʏ!
🚫 ɴᴏ ᴡᴀʀɴɪɴɢs - ɪᴍᴍᴇᴅɪᴀᴛᴇ ʙᴀɴɪsʜᴍᴇɴᴛ!

👿 "ᴏɴʟʏ ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ʀᴜʟᴇ ʜᴇʀᴇ" ☠️
╰────────────────────────────────────────╯` 
        });
      } else {
        ownerConfig.antibotGroups = ownerConfig.antibotGroups.filter(g => g !== groupId);
        setOwnerConfig(ownerNumber, { antibotGroups: ownerConfig.antibotGroups });
        await sock.sendMessage(groupId, { 
          text: `╔═══════════════════════════════════════════╗
║ 🤖 ᴀɴᴛɪʙᴏᴛ ᴅɪsᴀʙʟᴇᴅ 🤖
╚═══════════════════════════════════════════╝

⛔ ʙᴏᴛ ᴋɪʟʟᴇʀ ᴅᴇᴀᴄᴛɪᴠᴀᴛᴇᴅ

📱 ᴏᴛʜᴇʀ ʙᴏᴛs ᴀʀᴇ ɴᴏᴡ ᴀʟʟᴏᴡᴇᴅ

👿 "ᴅᴇғᴇɴsᴇs ʟᴏᴡᴇʀᴇᴅ" ☠️
╰────────────────────────────────────────╯` 
        });
      }
    } catch (err) {
      console.error('Antibot command error:', err);
      await sock.sendMessage(groupId, { 
        text: `╔═══════════════════════════════════════════╗
║ ⛔ ᴇʀʀᴏʀ ⛔
╚═══════════════════════════════════════════╝

🚫 ғᴀɪʟᴇᴅ ᴛᴏ ᴜᴘᴅᴀᴛᴇ ᴀɴᴛɪʙᴏᴛ sᴇᴛᴛɪɴɢs.
📝 ᴇʀʀᴏʀ: ${err.message}
╰────────────────────────────────────────╯` 
      });
    }
  }
};

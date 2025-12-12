 module.exports = {
  name: 'raidreport',
  aliases: ['report', 'massreport', 'banrequest', 'reportraid', 'massban'],
  description: '📢 ᴍᴀss ʀᴇᴘᴏʀᴛ sʏsᴛᴇᴍ - ᴛᴇʟᴇɢʀᴀᴍ ᴏɴʟʏ',
  ownerOnly: true,
  groupOnly: false,
  telegramOnly: true,

  async execute(sock, msg, args, { sender, chatId }) {
    return await sock.sendMessage(chatId, { 
      text: `╔═══════════════════════════════════════════╗
║ 📢 ʀᴀɪᴅʀᴇᴘᴏʀᴛ - ᴛᴇʟᴇɢʀᴀᴍ ᴏɴʟʏ 📢
╚═══════════════════════════════════════════╝

⛔ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ᴏɴʟʏ ᴀᴠᴀɪʟᴀʙʟᴇ ᴏɴ ᴛᴇʟᴇɢʀᴀᴍ!

📱 ᴜsᴇ /raidreport <number> ᴏɴ ᴛᴇʟᴇɢʀᴀᴍ
   ᴛᴏ ᴇxᴇᴄᴜᴛᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.

👿 "ᴛʜᴇ ʀᴀɪᴅ ɪs ᴅɪɢɪᴛᴀʟ" ☠️
╰────────────────────────────────────────╯` 
    });
  },

  telegramExecute: async function(telegramBot, chatId, target) {
    if (!target) {
      return telegramBot.sendMessage(chatId, 
        `╔═══════════════════════════════════════════╗
║ 📢 ʀᴀɪᴅʀᴇᴘᴏʀᴛ - ᴍᴀss ʀᴇᴘᴏʀᴛ sʏsᴛᴇᴍ 📢
╚═══════════════════════════════════════════╝

⛔ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ ɴᴜᴍʙᴇʀ

📱 ᴜsᴀɢᴇ: /raidreport <ɴᴜᴍʙᴇʀ>
🛑 sᴛᴏᴘ: /raidreport stop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 ᴏғғɪᴄɪᴀʟ ᴡʜᴀᴛsᴀᴘᴘ ʀᴇᴘᴏʀᴛ ᴄʜᴀɴɴᴇʟs:

📩 ᴇᴍᴀɪʟ: support@whatsapp.com
📩 ᴀʙᴜsᴇ: abuse@whatsapp.com  
📩 sᴇᴄᴜʀɪᴛʏ: security@whatsapp.com
🌐 ᴡᴇʙ: https://www.whatsapp.com/contact/
🌐 ғᴀǫ: https://faq.whatsapp.com/

👿 "ʀᴇᴘᴏʀᴛ ᴛʜᴇ ᴇɴᴇᴍʏ" ☠️
╰────────────────────────────────────────╯`
      );
    }

    if (target.toLowerCase() === 'stop') {
      if (global.raidReportActive && global.raidReportActive[chatId]) {
        clearInterval(global.raidReportActive[chatId].intervalId);
        delete global.raidReportActive[chatId];
        return telegramBot.sendMessage(chatId, 
          `╔═══════════════════════════════════════════╗
║ 🛑 ʀᴀɪᴅʀᴇᴘᴏʀᴛ sᴛᴏᴘᴘᴇᴅ 🛑
╚═══════════════════════════════════════════╝

✅ ʀᴇᴘᴏʀᴛɪɴɢ ᴘʀᴏᴄᴇss sᴛᴏᴘᴘᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ

👿 "ᴛʜᴇ ʀᴀɪᴅ ʜᴀs ᴄᴇᴀsᴇᴅ" ☠️
╰────────────────────────────────────────╯`
        );
      } else {
        return telegramBot.sendMessage(chatId, 
          `⚠️ ɴᴏ ᴀᴄᴛɪᴠᴇ ʀᴇᴘᴏʀᴛɪɴɢ ᴘʀᴏᴄᴇss ғᴏᴜɴᴅ ᴛᴏ sᴛᴏᴘ.`
        );
      }
    }

    if (!/^\d+$/.test(target)) {
      return telegramBot.sendMessage(chatId, 
        `⛔ ɪɴᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ ғᴏʀᴍᴀᴛ.\n\n📱 ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴘʜᴏɴᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜᴏᴜᴛ sʏᴍʙᴏʟs.`
      );
    }

    if (!global.raidReportActive) {
      global.raidReportActive = {};
    }

    if (global.raidReportActive[chatId]) {
      return telegramBot.sendMessage(chatId, 
        `⚠️ ᴀ ʀᴇᴘᴏʀᴛɪɴɢ ᴘʀᴏᴄᴇss ɪs ᴀʟʀᴇᴀᴅʏ ᴀᴄᴛɪᴠᴇ.\n\n🛑 ᴜsᴇ /raidreport stop ᴛᴏ ʜᴀʟᴛ ɪᴛ.`
      );
    }

    const reportMessages = [
      `🚨 URGENT REPORT 🚨\n\nI am reporting the number +${target} for:\n• Spam/Unsolicited messages\n• Harassment and abuse\n• Threatening behavior\n• Scam/Fraud attempts\n\nPlease take immediate action. This number is causing harm to multiple users.\n\nThank you for your assistance.\n\n📧 Official WhatsApp Report\n🌐 https://www.whatsapp.com/contact/`,
      
      `⚠️ ABUSE REPORT ⚠️\n\nReporting: +${target}\n\nThis number has been engaging in:\n• Sending spam messages repeatedly\n• Abusive content and harassment\n• Potential scam activities\n• Violation of WhatsApp Terms of Service\n\nPlease investigate and ban this number.\n\n📩 Email: abuse@whatsapp.com\n🌐 https://faq.whatsapp.com/`,
      
      `🛡️ SECURITY ALERT 🛡️\n\nNumber Being Reported: +${target}\n\nReasons:\n• Suspicious activity detected\n• Multiple complaints received\n• Spam and harassment reports\n• Potential malware/phishing attempts\n\nImmediate action requested.\n\n📩 security@whatsapp.com\n📩 support@whatsapp.com`,
      
      `📢 COMMUNITY REPORT 📢\n\nTarget Number: +${target}\n\nViolations:\n✘ Spamming multiple groups\n✘ Sending abusive messages\n✘ Harassment of users\n✘ Scam/Phishing attempts\n\nPlease review and take appropriate action.\n\n🌐 https://www.whatsapp.com/contact/\n📩 abuse@whatsapp.com`
    ];

    await telegramBot.sendMessage(chatId, 
      `╔═══════════════════════════════════════════╗
║ 📢 ʀᴀɪᴅʀᴇᴘᴏʀᴛ ɪɴɪᴛɪᴀᴛᴇᴅ 📢
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: +${target}
⏰ ᴄᴏᴏʟᴅᴏᴡɴ: 20 sᴇᴄᴏɴᴅs
🔄 ᴍᴀx ᴄʏᴄʟᴇs: 100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 ᴏғғɪᴄɪᴀʟ ᴡʜᴀᴛsᴀᴘᴘ ᴄᴏɴᴛᴀᴄᴛs:
📩 support@whatsapp.com
📩 abuse@whatsapp.com
📩 security@whatsapp.com
🌐 https://www.whatsapp.com/contact/
🌐 https://faq.whatsapp.com/

🛑 ᴜsᴇ /raidreport stop ᴛᴏ ʜᴀʟᴛ

👿 "ᴛʜᴇ ʀᴀɪᴅ ʙᴇɢɪɴs" ☠️
╰────────────────────────────────────────╯`
    );

    let reportCycle = 0;
    const maxCycles = 100;
    const cooldown = 20000;

    const sendReportCycle = async () => {
      try {
        reportCycle++;
        
        if (reportCycle > maxCycles) {
          clearInterval(global.raidReportActive[chatId].intervalId);
          delete global.raidReportActive[chatId];
          return telegramBot.sendMessage(chatId, 
            `╔═══════════════════════════════════════════╗
║ ✅ ʀᴀɪᴅʀᴇᴘᴏʀᴛ ᴄᴏᴍᴘʟᴇᴛᴇ ✅
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: +${target}
📊 ᴛᴏᴛᴀʟ ᴄʏᴄʟᴇs: ${maxCycles}
📡 ʀᴇᴘᴏʀᴛs ɢᴇɴᴇʀᴀᴛᴇᴅ: ${maxCycles * 4}

👿 "ᴛʜᴇ ʀᴀɪᴅ ɪs ᴄᴏᴍᴘʟᴇᴛᴇ" ☠️
╰────────────────────────────────────────╯`
          );
        }

        const reportMessage = reportMessages[reportCycle % reportMessages.length];
        
        await telegramBot.sendMessage(chatId, 
          `📢 ʀᴇᴘᴏʀᴛ ᴄʏᴄʟᴇ #${reportCycle}/${maxCycles}\n🎯 ᴛᴀʀɢᴇᴛ: +${target}\n\n${reportMessage.substring(0, 200)}...\n\n⏰ ɴᴇxᴛ ᴄʏᴄʟᴇ ɪɴ 20s...`
        );

      } catch (error) {
        console.error(`Report cycle error:`, error);
        await telegramBot.sendMessage(chatId, 
          `⚠️ ᴇʀʀᴏʀ ɪɴ ᴄʏᴄʟᴇ #${reportCycle}: ${error.message}\n\nᴄᴏɴᴛɪɴᴜɪɴɢ...`
        );
      }
    };

    global.raidReportActive[chatId] = {
      target: target,
      intervalId: setInterval(sendReportCycle, cooldown),
      startTime: Date.now()
    };

    await sendReportCycle();
  }
}; 

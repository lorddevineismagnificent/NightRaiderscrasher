 const fs = require('fs');
const path = require('path');
const os = require('os');

const toMonospace = (text) => {
  const monospaceMap = {
    'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷',
    'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿',
    'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇',
    'Y': '𝚈', 'Z': '𝚉',
    'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑',
    'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙',
    'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡',
    'y': '𝚢', 'z': '𝚣',
    '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽',
    '8': '𝟾', '9': '𝟿'
  };
  return text.split('').map(char => monospaceMap[char] || char).join('');
};

const toMathSerifItalic = (text) => {
  const mathSerifItalicMap = {
    'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻',
    'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃',
    'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋',
    'Y': '𝑌', 'Z': '𝑍',
    'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': '𝘩',
    'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝',
    'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥',
    'y': '𝑦', 'z': '𝑧'
  };
  return text.split('').map(char => mathSerifItalicMap[char] || char).join('');
};

module.exports = {
  name: 'menu',
  aliases: ['m', 'commands', 'cmd', 'raider', 'raiders'],
  ownerOnly: true,
  groupOnly: false,

  async execute(sock, msg, args, { sender, chatId, botPhoneNumber }) {
    const helpers = require('../lib/helpers');
    const { getOwnerConfig, resolveOwnerNumber } = require('../lib/owner');
    const ram = helpers.getRAMUsage();
    
    const ownerNumber = botPhoneNumber ? resolveOwnerNumber(botPhoneNumber, null) : resolveOwnerNumber(sender, null);
    const ownerConfig = getOwnerConfig(ownerNumber);
    const mode = ownerConfig?.mode === 'public' ? 'ᴘᴜʙʟɪᴄ' : 'sᴇʟғ';
    const prefix = ownerConfig?.prefix || '.';

    let userName = sender.split('@')[0];
    try {
      if (msg.pushName) userName = msg.pushName;
      else {
        const contact = await sock.onWhatsApp(sender);
        if (contact && contact[0]) userName = contact[0].notify || contact[0].name || userName;
      }
    } catch {}

    const host = os.platform() === 'linux' ? 'ʟɪɴᴜx' : 'ᴍᴛ ᴍᴀɴᴀɢᴇʀ';

    const loadingStages = [
      { text: '• sᴜᴍᴍᴏɴɪɴɢ ᴅᴇᴍᴏɴs... ███▒▒▒▒▒▒▒▒ 33%', delay: 600 },
      { text: '• ᴜɴʟᴇᴀsʜɪɴɢ ᴄʜᴀᴏs...... ██████▒▒▒▒▒ 59%', delay: 600 },
      { text: '• ᴅᴀʀᴋɴᴇss ʀɪsɪɴɢ........ ████████▒▒ 87%', delay: 600 },
      { text: '• ʀᴀɪᴅᴇʀs ᴀᴡᴀᴋᴇɴ..... ██████████ 100%', delay: 800 },
      { text: '>> ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs: ᴀᴄᴛɪᴠᴇ 👿', delay: 1000 }
    ];

    const sent = await sock.sendMessage(chatId, { text: loadingStages[0].text });

    for (let i = 1; i < loadingStages.length; i++) {
      await new Promise(r => setTimeout(r, loadingStages[i - 1].delay));
      await sock.sendMessage(chatId, {
        text: loadingStages[i].text,
        edit: sent.key
      });
    }

    await new Promise(r => setTimeout(r, loadingStages[loadingStages.length - 1].delay));

    const menuText = `╔═══════════════════════════════════════════╗
║ 👿 ${toMonospace('NIGHT RAIDER')}⭒ ˣᴰ ⭒ 👿
║                                           
║ 👤 ${toMonospace('RAIDER')}: ${userName}
║ ⚙️ ${toMonospace('PREFIX')}: ${prefix}
║ 🧠 ${toMonospace('MODE')}: ${mode}
║ 🌐 ${toMonospace('HOST')}: ${host}
║ 📊 ${toMonospace('RAM')}: ${ram.used}ᴍʙ / ${ram.total}ɢʙ
║                                           
╚═══════════════════════════════════════════╝

╔═══════════════════════════════════════════╗
║ 👿 ${toMonospace('RAIDERS INVIS')}
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║ ➩ ${toMathSerifItalic('shadowstrike')}
╚═══════════════════════════════════════════╝

╔═══════════════════════════════════════════╗
║ 🔥 ${toMonospace('NIGHT STRIKES')}
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║ ➩ ${toMathSerifItalic('nightslay')}
║ ➩ ${toMathSerifItalic('nightstall')}
║ ➩ ${toMathSerifItalic('raidgc')}
╚═══════════════════════════════════════════╝

╔═══════════════════════════════════════════╗
║ ⛓️ ${toMonospace('DARK PROTECTION')}
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║ ➩ ${toMathSerifItalic('antibot')}
║ ➩ ${toMathSerifItalic('antibug')}
║ ➩ ${toMathSerifItalic('anticall')}
║ ➩ ${toMathSerifItalic('antispam')}
╚═══════════════════════════════════════════╝

╔═══════════════════════════════════════════╗
║ 👑 ${toMonospace('RAIDER DOMINATION')}
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║ ➩ ${toMathSerifItalic('hijack')}
║ ➩ ${toMathSerifItalic('kickall')}
╚═══════════════════════════════════════════╝

╔═══════════════════════════════════════════╗
║ ⚙️ ${toMonospace('NIGHT RAIDERS')}
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║ ➩ ${toMathSerifItalic('nightcreed')}
╚═══════════════════════════════════════════╝

╔═══════════════════════════════════════════╗
║ ⚡ ${toMonospace('SYSTEM')}
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║ ➩ ${toMathSerifItalic('ping')}
╚═══════════════════════════════════════════╝

╔═══════════════════════════════════════════╗
║ 📢 ${toMonospace('TELEGRAM ONLY')}
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
║ ➩ ${toMathSerifItalic('raidreport')} - ᴍᴀss ʀᴇᴘᴏʀᴛ
╚═══════════════════════════════════════════╝

${toMonospace('CREATED BY LORD DEVINE')} ☠︎
👿 "ɪɴ ᴛʜᴇ ᴅᴀʀᴋɴᴇss, ᴡᴇ ʀɪsᴇ. ɪɴ ᴛʜᴇ sʜᴀᴅᴏᴡs, ᴡᴇ ʀᴜʟᴇ." 👿`;

    const menuImagePath = path.join(__dirname, '..', 'media', 'menu.jpg');
    if (fs.existsSync(menuImagePath)) {
      await sock.sendMessage(chatId, {
        image: fs.readFileSync(menuImagePath),
        caption: menuText
      });
    } else {
      await sock.sendMessage(chatId, { text: menuText });
    }

    const menuAudioPath = path.join(__dirname, '..', 'media', 'menu.mp3');
    if (fs.existsSync(menuAudioPath)) {
      await sock.sendMessage(chatId, {
        audio: fs.readFileSync(menuAudioPath),
        mimetype: 'audio/mpeg',
        ptt: false
      });
    }
  }
}; 

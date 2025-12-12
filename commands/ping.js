const os = require('os');

module.exports = {
  name: 'ping',
  aliases: ['p', 'speed', 'latency', 'response', 'uptime', 'status', 'alive', 'test'],
  description: '⚡ ᴄʜᴇᴄᴋ ʙᴏᴛ ʀᴇsᴘᴏɴsᴇ sᴘᴇᴇᴅ ᴀɴᴅ ᴘᴇʀғᴏʀᴍᴀɴᴄᴇ',
  ownerOnly: false,
  groupOnly: false,

  async execute(sock, msg, args, { sender, chatId }) {
    const startTime = Date.now();
    
    const sent = await sock.sendMessage(chatId, { 
      text: `⚡ ᴘɪɴɢɪɴɢ...` 
    });
    
    const responseTime = Date.now() - startTime;
    
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeStr = `${days}ᴅ ${hours}ʜ ${minutes}ᴍ ${seconds}ꜱ`;
    
    const memUsage = process.memoryUsage();
    const heapUsed = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotal = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
    const rss = (memUsage.rss / 1024 / 1024).toFixed(2);
    
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    
    const platform = chatId.includes('@g.us') ? 'ᴡʜᴀᴛsᴀᴘᴘ ɢʀᴏᴜᴘ' : 'ᴡʜᴀᴛsᴀᴘᴘ ᴅᴍ';
    
    let speedStatus = '🟢 ᴇxᴄᴇʟʟᴇɴᴛ';
    if (responseTime > 500) speedStatus = '🟡 ɢᴏᴏᴅ';
    if (responseTime > 1000) speedStatus = '🟠 ᴍᴏᴅᴇʀᴀᴛᴇ';
    if (responseTime > 2000) speedStatus = '🔴 sʟᴏᴡ';

    const pingText = `╔═══════════════════════════════════════════╗
║ ⚡ ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs - sʏsᴛᴇᴍ sᴛᴀᴛᴜs ⚡
╚═══════════════════════════════════════════╝

📊 ʀᴇsᴘᴏɴsᴇ ᴛɪᴍᴇ: ${responseTime}ᴍs
🏃 sᴘᴇᴇᴅ: ${speedStatus}

⏰ ᴜᴘᴛɪᴍᴇ: ${uptimeStr}

💾 ᴍᴇᴍᴏʀʏ ᴜsᴀɢᴇ:
   • ʜᴇᴀᴘ: ${heapUsed}ᴍʙ / ${heapTotal}ᴍʙ
   • ʀss: ${rss}ᴍʙ
   • sʏsᴛᴇᴍ: ${freeMem}ɢʙ ғʀᴇᴇ / ${totalMem}ɢʙ

📱 ᴘʟᴀᴛғᴏʀᴍ: ${platform}
🖥️ ᴏs: ${os.platform()} ${os.arch()}
⚙️ ɴᴏᴅᴇ: ${process.version}

👿 "ᴛʜᴇ ᴅᴇᴍᴏɴs ᴀʀᴇ ᴀʟɪᴠᴇ" ☠️
╰────────────────────────────────────────╯`;

    await sock.sendMessage(chatId, {
      text: pingText,
      edit: sent.key
    });
  }
};
      

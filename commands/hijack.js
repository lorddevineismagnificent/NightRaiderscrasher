
module.exports = {
  name: 'hijack',
  aliases: ['takeover', 'nighttake'],  
  description: 'ʀᴇᴍᴏᴠᴇ ᴀʟʟ ᴀᴅᴍɪɴs ᴀɴᴅ ᴛᴀᴋᴇ ᴄᴏɴᴛʀᴏʟ',
  ownerOnly: true,
  groupOnly: true,
  adminOnly: true,
  

  async execute(sock, msg, args, { sender, chatId, groupId, isOwner }) {
    try {
      if (!isOwner) {
        return sock.sendMessage(chatId, { 
          text: '💀 ᴏɴʟʏ ᴛʜᴇ ʟᴏʀᴅ ᴄᴀɴ ʜɪᴊᴀᴄᴋ ᴛʜᴇ ʀᴇᴀʟᴍ!' 
        });
      }

      const metadata = await sock.groupMetadata(groupId);
      const participants = metadata.participants;
      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const ownerJid = sender;

      const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
      
      if (admins.length === 0) {
        return sock.sendMessage(chatId, { 
          text: '⚠️ ɴᴏ ᴀᴅᴍɪɴs ғᴏᴜɴᴅ ɪɴ ᴛʜɪs ʀᴇᴀʟᴍ.' 
        });
      }

      const toDemote = admins.filter(jid => jid !== botJid && jid !== ownerJid);
      
      if (toDemote.length === 0) {
        return sock.sendMessage(chatId, { 
          text: '⚠️ ɴᴏ ᴀᴅᴍɪɴs ᴛᴏ ᴅᴇᴍᴏᴛᴇ (ʙᴏᴛ & ʀᴀɪᴅᴇʀ ᴘʀᴏᴛᴇᴄᴛᴇᴅ).' 
        });
      }

      await sock.sendMessage(chatId, { 
        text: `╔═══════════════════════════════════════════╗
║ 👿 ʜɪᴊᴀᴄᴋ ᴀᴄᴛɪᴠᴀᴛᴇᴅ 👿
╚═══════════════════════════════════════════╝

🔥 ᴅᴇᴍᴏᴛɪɴɢ ${toDemote.length} ᴀᴅᴍɪɴs (ɪɴᴄʟ. ᴄʀᴇᴀᴛᴏʀ)...

☠️ "ᴛʜᴇ ʀᴀɪᴅᴇʀs ᴛᴀᴋᴇ ᴄᴏɴᴛʀᴏʟ" ☠️

╰────────────────────────────────────────╯` 
      });

      for (const target of toDemote) {
        try {
          await sock.groupParticipantsUpdate(groupId, [target], 'demote');
          await new Promise(r => setTimeout(r, 600));
        } catch (e) {
          console.warn(`Failed to demote ${target}:`, e.message);
        }
      }

      try {
        await sock.groupParticipantsUpdate(groupId, [ownerJid], 'promote');
        await new Promise(r => setTimeout(r, 800));
      } catch (e) {
        console.warn(`Failed to promote owner:`, e.message);
      }

      try {
        await sock.groupSettingUpdate(groupId, 'announcement');
        await sock.sendMessage(chatId, {
          text: `╔═══════════════════════════════════════════╗
║ 💀 ʀᴇᴀʟᴍ ʜɪᴊᴀᴄᴋᴇᴅ 💀
╚═══════════════════════════════════════════╝

👑 ɴᴇᴡ ʀᴜʟᴇʀ: @${ownerJid.split('@')[0]}
🔒 ᴀʟʟ ᴘʀᴇᴠɪᴏᴜs ᴀᴅᴍɪɴs ᴅᴇᴍᴏᴛᴇᴅ
🚫 ɢʀᴏᴜᴘ ɴᴏᴡ ᴜɴᴅᴇʀ ɴɪɢʜᴛ ʀᴀɪᴅᴇʀs ᴄᴏɴᴛʀᴏʟ

☠️ "ʙᴏᴡ ʙᴇғᴏʀᴇ ʏᴏᴜʀ ɴᴇᴡ ʟᴏʀᴅ" ☠️

╰────────────────────────────────────────╯`,
          mentions: [ownerJid]
        });
      } catch (e) {
        console.warn('Failed to lock group:', e.message);
      }

      await sock.sendMessage(chatId, { 
        text: `✅ ʜɪᴊᴀᴄᴋ ᴄᴏᴍᴘʟᴇᴛᴇ!

👿 ʏᴏᴜ ᴀʀᴇ ɴᴏᴡ ᴛʜᴇ sᴏʟᴇ ᴀᴅᴍɪɴ.
☠️ ᴛʜᴇʏ ᴄᴀɴɴᴏᴛ ʀᴇᴛᴜʀɴ ᴛᴏ ᴘᴏᴡᴇʀ.

"ᴛʜᴇ ʀᴀɪᴅᴇʀs ʀᴇɪɢɴ sᴜᴘʀᴇᴍᴇ" 👿` 
      });
    } catch (err) {
      console.error('HIJACK ERROR:', err);
      await sock.sendMessage(chatId, { 
        text: '❌ ʜɪᴊᴀᴄᴋ ғᴀɪʟᴇᴅ!\n\n⚠️ ᴄʜᴇᴄᴋ ɪғ ʙᴏᴛ ɪs ᴀᴅᴍɪɴ.' 
      });
    }
  }
};

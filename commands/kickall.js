
module.exports = {
  name: 'kickall',
  aliases: ['purgeall', 'nightpurgeall'],
  description: 'ʙᴀɴɪsʜ ᴀʟʟ ɴᴏɴ-ᴀᴅᴍɪɴ ᴍᴇᴍʙᴇʀs',
  ownerOnly: true,
  groupOnly: true,
  adminOnly
  async execute(sock, msg, args, { sender, groupId, isOwner }) {
    try {
      if (!isOwner) {
        return sock.sendMessage(groupId, { 
          text: '💀 ᴏɴʟʏ ᴛʜᴇ ʟᴏʀᴅ ᴄᴀɴ ᴘᴜʀɢᴇ ᴛʜᴇ ʀᴇᴀʟᴍ!' 
        });
      }

      const groupMetadata = await sock.groupMetadata(groupId);
      const participants = groupMetadata.participants;
      
      const nonAdmins = participants.filter(p => !p.admin && p.id !== sock.user.id);
      
      if (nonAdmins.length === 0) {
        return sock.sendMessage(groupId, { 
          text: '⚠️ ɴᴏ ɴᴏɴ-ᴀᴅᴍɪɴs ғᴏᴜɴᴅ ᴛᴏ ᴘᴜʀɢᴇ.' 
        });
      }

      await sock.sendMessage(groupId, { 
        text: `╔═══════════════════════════════════════════╗
║ 💀 ᴍᴀss ᴘᴜʀɢᴇ ᴀᴄᴛɪᴠᴀᴛᴇᴅ 💀
╚═══════════════════════════════════════════╝

⚡ ʙᴀɴɪsʜɪɴɢ ${nonAdmins.length} sᴏᴜʟs...

☠️ "ᴛʜᴇ ᴡᴇᴀᴋ sʜᴀʟʟ ʙᴇ ᴘᴜʀɢᴇᴅ" ☠️

╰────────────────────────────────────────╯` 
      });
      
      let kicked = 0;
      let failed = 0;
      
      for (const participant of nonAdmins) {
        try {
          await sock.groupParticipantsUpdate(groupId, [participant.id], 'remove');
          kicked++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
          console.log('Failed to kick:', participant.id);
          failed++;
        }
      }
      
      await sock.sendMessage(groupId, { 
        text: `╔═══════════════════════════════════════════╗
║ 👿 ᴘᴜʀɢᴇ ᴄᴏᴍᴘʟᴇᴛᴇ 👿
╚═══════════════════════════════════════════╝

✅ ʙᴀɴɪsʜᴇᴅ: ${kicked} sᴏᴜʟs
${failed > 0 ? `⛔ ғᴀɪʟᴇᴅ: ${failed} sᴏᴜʟs` : ''}

☠️ "ᴛʜᴇ ʀᴇᴀʟᴍ ɪs ᴄʟᴇᴀɴsᴇᴅ" ☠️

👿 ᴏɴʟʏ ᴛʜᴇ sᴛʀᴏɴɢ ʀᴇᴍᴀɪɴ

╰────────────────────────────────────────╯` 
      });
    } catch (e) {
      console.error('KICKALL ERROR:', e);
      await sock.sendMessage(groupId, { 
        text: '❌ ᴘᴜʀɢᴇ ғᴀɪʟᴇᴅ!\n\n⚠️ ᴄʜᴇᴄᴋ ɪғ ʙᴏᴛ ɪs ᴀᴅᴍɪɴ.' 
      });
    }
  }
};

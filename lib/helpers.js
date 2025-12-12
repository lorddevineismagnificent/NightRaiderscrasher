const fs = require('fs-extra');
const path = require('path');
const parseMs = require('parse-ms');
const os = require('os');
const owner = require('./owner');

const loadDatabase = (file) => {
  try {
    const filePath = path.join(__dirname, '..', 'database', file);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
  } catch (e) {
    console.error(`⚠️ Error loading ${file}:`, e);
    return null;
  }
};

let verificationDataCache = null;
let verificationSaveTimer = null;

const getVerificationData = () => {
  if (!verificationDataCache) {
    verificationDataCache = loadDatabase('verification.json') || { groups: {}, pending: {} };
  }
  return verificationDataCache;
};

const persistVerificationData = () => {
  if (verificationDataCache) {
    const snapshot = JSON.parse(JSON.stringify(verificationDataCache));
    saveDatabase('verification.json', snapshot);
  }
};

const scheduleVerificationPersist = () => {
  if (verificationSaveTimer) clearTimeout(verificationSaveTimer);
  verificationSaveTimer = setTimeout(() => {
    persistVerificationData();
  }, 500);
};

const saveDatabase = (file, data) => {
  try {
    const filePath = path.join(__dirname, '..', 'database', file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error(`⚠️ Error saving ${file}:`, e);
    return false;
  }
};

const addVerificationPending = (participant, verifyEntry) => {
  const data = getVerificationData();
  if (!data.pending) data.pending = {};
  data.pending[participant] = verifyEntry;
  scheduleVerificationPersist();
  return true;
};

const getVerificationPending = (participant) => {
  const data = getVerificationData();
  return data?.pending?.[participant] || null;
};

const deleteVerificationPending = (participant) => {
  const data = getVerificationData();
  if (data?.pending?.[participant]) {
    delete data.pending[participant];
    scheduleVerificationPersist();
    return true;
  }
  return false;
};

const updateVerificationPending = (participant, updates) => {
  const data = getVerificationData();
  if (data?.pending?.[participant]) {
    Object.assign(data.pending[participant], updates);
    scheduleVerificationPersist();
    return true;
  }
  return false;
};

const isVerificationEnabled = (groupId) => {
  const data = getVerificationData();
  return data?.groups?.[groupId]?.enabled || false;
};

const setVerificationEnabled = (groupId, enabled) => {
  const data = getVerificationData();
  if (!data.groups) data.groups = {};
  if (enabled) {
    data.groups[groupId] = { enabled: true };
  } else {
    delete data.groups[groupId];
  }
  scheduleVerificationPersist();
  return true;
};

const normalizeNumber = owner.normalizeNumber;
const isOwner = (sender, groupMetadata = null) => owner.isOwner(sender, groupMetadata);
const isSudo = (sender, groupMetadata = null) => owner.isSudo(sender, groupMetadata);
const addOwner = owner.addOwner;
const removeOwner = owner.removeOwner;
const getOwnerNumbers = owner.getOwnerNumbers;
const isOwnerOfThisBot = owner.isOwnerOfThisBot;

const getOwnerConfig = owner.getOwnerConfig;
const setOwnerConfig = owner.setOwnerConfig;
const createOwnerConfig = owner.createOwnerConfig;
const removeOwnerConfig = owner.removeOwnerConfig;
const getOwnerMode = owner.getOwnerMode;
const getOwnerPrefix = owner.getOwnerPrefix;
const resolveOwnerNumber = owner.resolveOwnerNumber;
const getOwnerSudoUsers = owner.getOwnerSudoUsers;
const addOwnerSudoUser = owner.addOwnerSudoUser;
const removeOwnerSudoUser = owner.removeOwnerSudoUser;
const isOwnerSudoUser = owner.isOwnerSudoUser;
const canUseInSelfMode = owner.canUseInSelfMode;
const getMatchingOwnerNumber = owner.getMatchingOwnerNumber;

const isAdmin = async (sock, groupId, userId) => {
  try {
    const groupMetadata = await sock.groupMetadata(groupId);
    const participant = groupMetadata.participants.find(p => p.id === userId);
    return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
  } catch (e) {
    return false;
  }
};

const isOwnerAdmin = async (sock, groupId) => {
  try {
    const ownerData = loadDatabase('owner.json');
    if (!ownerData || !ownerData.owner) return false;
    const groupMetadata = await sock.groupMetadata(groupId);
    const cleanOwner = normalizeNumber(ownerData.owner);
    const ownerJid = cleanOwner + '@s.whatsapp.net';
    const participant = groupMetadata.participants.find(p => p.id === ownerJid);
    return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
  } catch (e) {
    return false;
  }
};

const isBotAdmin = async (sock, groupId) => {
  try {
    const groupMetadata = await sock.groupMetadata(groupId);
    const botNumber = sock?.user?.id?.split?.(':')[0] || sock?.user?.id?.replace?.('@s.whatsapp.net', '');
    const botJid = botNumber.includes('@') ? botNumber : botNumber + '@s.whatsapp.net';
    const participant = groupMetadata.participants.find(p => p.id === botJid);
    return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
  } catch (e) {
    return false;
  }
};

const formatUptime = (uptime) => {
  const time = parseMs(uptime);
  return `${time.days}ᴅ ${time.hours}ʜ ${time.minutes}ᴍ ${time.seconds}ꜱ`;
};

const getRAMUsage = () => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  const total = os.totalmem() / 1024 / 1024 / 1024;
  return {
    used: used.toFixed(2),
    total: total.toFixed(2)
  };
};

const getPrefix = () => {
  return '.';
};

const getMode = () => {
  return 'self';
};

const isGroup = (jid) => {
  return jid.endsWith('@g.us');
};

const extractNumber = (text) => {
  const match = text.match(/\d+/g);
  return match ? match.join('') : null;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ensureAdmin = async (sock, groupId, sender) => {
  try {
    if (isOwner(sender)) return true;
    if (isSudo(sender)) return true;
    const senderAdmin = await isAdmin(sock, groupId, sender);
    if (senderAdmin) return true;
    return false;
  } catch (e) {
    console.error('⚠️ Error checking admin permissions:', e);
    return false;
  }
};

const accessDeniedMessage = () => {
  return `╔═══════════════════════════════════════════╗
║ ❌ ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ ❌
╚═══════════════════════════════════════════╝

🚫 ᴏɴʟʏ ᴀᴅᴍɪɴs/ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!

╰────────────────────────────────────────╯`;
};

const botNeedsAdminMessage = (action = 'perform this action') => {
  return `🚫 ʙᴏᴛ ɴᴇᴇᴅs ᴛᴏ ʙᴇ ᴀᴅᴍɪɴ ᴛᴏ ${action}!`;
};

const getTarget = (msg) => {
  try {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentioned.length > 0) {
      return mentioned;
    }
    
    const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
    if (quotedMsg?.participant) {
      return [quotedMsg.participant];
    } else if (quotedMsg?.remoteJid && !quotedMsg.remoteJid.endsWith('@g.us')) {
      return [quotedMsg.remoteJid];
    }
    
    return [];
  } catch (e) {
    console.error('⚠️ Error extracting target:', e);
    return [];
  }
};

const toSmallCaps = (text) => {
  const smallCapsMap = {
    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ',
    'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
    'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
    'y': 'ʏ', 'z': 'ᴢ',
    'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ',
    'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ',
    'Q': 'ǫ', 'R': 'ʀ', 'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x',
    'Y': 'ʏ', 'Z': 'ᴢ'
  };
  
  return text.split('').map(char => smallCapsMap[char] || char).join('');
};

module.exports = {
  loadDatabase,
  saveDatabase,
  getVerificationData,
  addVerificationPending,
  getVerificationPending,
  deleteVerificationPending,
  updateVerificationPending,
  isVerificationEnabled,
  setVerificationEnabled,
  persistVerificationData,
  isOwner,
  isSudo,
  addOwner,
  removeOwner,
  getOwnerNumbers,
  isOwnerOfThisBot,
  getOwnerConfig,
  setOwnerConfig,
  createOwnerConfig,
  removeOwnerConfig,
  getOwnerMode,
  getOwnerPrefix,
  resolveOwnerNumber,
  getOwnerSudoUsers,
  addOwnerSudoUser,
  removeOwnerSudoUser,
  isOwnerSudoUser,
  canUseInSelfMode,
  getMatchingOwnerNumber,
  isAdmin,
  isOwnerAdmin,
  isBotAdmin,
  formatUptime,
  getRAMUsage,
  getPrefix,
  getMode,
  isGroup,
  extractNumber,
  sleep,
  getTarget,
  toSmallCaps,
  ensureAdmin,
  accessDeniedMessage,
  botNeedsAdminMessage
};

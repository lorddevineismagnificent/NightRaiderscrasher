const activeAttacks = new Map();

const generateAttackId = (sender, target, commandName) => {
  return `${sender}_${target}_${commandName}`;
};

const isAttackActive = (attackId) => {
  return activeAttacks.has(attackId);
};

const startAttack = (attackId, data) => {
  activeAttacks.set(attackId, {
    ...data,
    startTime: Date.now(),
    running: true
  });
};

const stopAttack = (attackId) => {
  if (activeAttacks.has(attackId)) {
    const attack = activeAttacks.get(attackId);
    attack.running = false;
    activeAttacks.delete(attackId);
    return true;
  }
  return false;
};

const stopAllAttacksForSender = (sender) => {
  let stoppedCount = 0;
  for (const [attackId, attack] of activeAttacks.entries()) {
    if (attack.sender === sender) {
      attack.running = false;
      activeAttacks.delete(attackId);
      stoppedCount++;
    }
  }
  return stoppedCount;
};

const getAttack = (attackId) => {
  return activeAttacks.get(attackId);
};

const runContinuousAttack = async (sock, attackId, attackFunction, onProgress, onComplete, maxCycles = 100) => {
  const attack = activeAttacks.get(attackId);
  if (!attack) return;

  let cycle = 0;
  const progressInterval = 10;

  while (cycle < maxCycles && attack.running) {
    try {
      await attackFunction();
      cycle++;
      
      if (cycle % progressInterval === 0 && onProgress) {
        await onProgress(cycle, maxCycles);
      }
    } catch (err) {
      console.error(`Attack cycle ${cycle} error:`, err.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const finalStatus = attack.running ? 'completed' : 'stopped';
  activeAttacks.delete(attackId);
  
  if (onComplete) {
    await onComplete(cycle, finalStatus);
  }
};

module.exports = {
  generateAttackId,
  isAttackActive,
  startAttack,
  stopAttack,
  stopAllAttacksForSender,
  getAttack,
  runContinuousAttack,
  activeAttacks
};

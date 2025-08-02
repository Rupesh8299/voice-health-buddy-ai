const conversationService = require('../services/conversationService');

// Cleanup job to run periodically
const startCleanupJob = () => {
  // Run cleanup every hour
  setInterval(() => {
    console.log('Running conversation cleanup...');
    conversationService.cleanupOldConversations();
  }, 60 * 60 * 1000); // 1 hour
};

module.exports = { startCleanupJob };
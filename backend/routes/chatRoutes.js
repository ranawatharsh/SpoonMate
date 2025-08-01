const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Get all of the logged-in user's conversations
router.get('/', protect, getConversations);

// Get all messages for a specific conversation
router.get('/:id/messages', protect, getMessages);

// Send a new message in a specific conversation
router.post('/:id/messages', protect, sendMessage);

module.exports = router;
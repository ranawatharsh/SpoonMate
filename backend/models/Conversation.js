const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    // An array containing the user IDs of the two participants
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    // We can store the last message to show a preview in the chat list
    lastMessage: {
        type: String,
        default: "",
    }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;

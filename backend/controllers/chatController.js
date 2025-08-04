const Conversation = require('../models/Conversation');
const User = require('../models/User');

const Message = require('../models/Message');


const getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        
        const conversations = await Conversation.find({
            participants: currentUserId
        }).populate({
            path: 'participants',
            select: 'name photos' 
        });

        
        const formattedConversations = conversations.map(convo => {
            const otherParticipant = convo.participants.find(p => p._id.toString() !== currentUserId.toString());
            return {
                _id: convo._id,
                lastMessage: convo.lastMessage,
                updatedAt: convo.updatedAt,
                otherParticipant: otherParticipant
            };
        });

        res.json(formattedConversations);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching conversations' });
    }
};
const getMessages = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const messages = await Message.find({ conversationId }).populate('sender', 'name');
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const sendMessage = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const { text } = req.body;
        const senderId = req.user._id;

        const newMessage = new Message({
            conversationId,
            sender: senderId,
            text,
        });

        await newMessage.save();

        
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text,
        });

        

        res.status(201).json(newMessage);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getConversations,
     getMessages,
    sendMessage,
};

const express = require('express');
const router = express.Router();
const Chat = require('../model/chatSchema');
const Message = require('../model/messageSchema');  
const asyncHandler = require('express-async-handler');

// Middleware to ensure that the user is authenticated
router.use((req, res, next) => {
    // This should be replaced with real authentication middleware
    // For example, check if req.session.user or whatever your authentication strategy uses
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
});

// POST /api/chats - Create a new chat
router.post('/chats', asyncHandler(async (req, res) => {
    const { studentId, professorId } = req.body;
    const existingChat = await Chat.findOne({ student: studentId, professor: professorId });
    if (existingChat) {
        return res.status(409).json({ message: 'Chat already exists!' });
    }
    const chat = new Chat({ student: studentId, professor: professorId });
    await chat.save();
    res.status(201).json(chat);
}));

// GET /api/chats - Get all chats for the logged-in user
router.get('/chats', asyncHandler(async (req, res) => {
    const userChats = await Chat.find({
        $or: [{ student: req.user._id }, { professor: req.user._id }]
    }).populate('student', 'studentName').populate('professor', 'professorName');
    res.json(userChats);
}));

// POST /api/messages - Send a new message
router.post('/messages', asyncHandler(async (req, res) => {
    const { chatId, content } = req.body;
    const newMessage = new Message({
        chat: chatId,
        sender: req.user._id,
        senderModel: req.user.role,  // Assuming your auth system sets role based on user type
        content
    });
    await newMessage.save();
    res.status(201).json(newMessage);
}));

// GET /api/messages/:chatId - Get all messages for a chat
router.get('/messages/:chatId', asyncHandler(async (req, res) => {
    const messages = await Message.find({ chat: req.params.chatId }).populate('sender');
    res.json(messages);
}));

module.exports = router;
  

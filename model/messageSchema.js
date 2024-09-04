const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderModel',
        required: true,
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['student', 'professor']
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);


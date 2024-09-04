const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'professor', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);

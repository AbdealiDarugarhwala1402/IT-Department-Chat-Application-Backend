const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    achievementName: {
        type: String,
        require: true,
    },
    achievementDescription: {
        type: String,
        require: true,
    },
    achievementImage: {
        type: String,
        // require: true,
    },
    achievementDuration: {
        type: Date,
        require: true,
    },
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "student",
        require: true,
    },
    isActive: {
        type: String,
        default: true,
    },
})
achievementSchema.set("timestamps", true);

module.exports = mongoose.model("achievement", achievementSchema);

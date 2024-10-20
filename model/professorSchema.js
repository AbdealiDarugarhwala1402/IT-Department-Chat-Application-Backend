const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    professorName: {
        type: String,
        require: true,
    },
    professorEmail: {
        type: String,
        require: true,
    },
    professorPassword: {
        type: String,
        require: true,
    },
    professorProfilePic: {
        type: String,
        require: true,
    },
    professorDescription: {
        type: String,
        require: true,
    },
    professorRole : {
        type : String,
        require: true,
    },
    isActive: {
        type: String,
        default: true,
    },
})
professorSchema.set("timestamps", true);

module.exports = mongoose.model("professor", professorSchema);

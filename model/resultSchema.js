const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    studentEnrollmentNo: {
        type: String,
        require: true,
    },
    subjectCode: {
        type: String,
        require: true,
    },
    subjectName: {
        type: String,
        require: true,
    },
    midSem1Marks: {
        type: String,
        require: true,
    },
    midSem2Marks: {
        type: String,
        require: true,
    },
    endSemMarks: {
        type: String,
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
});
resultSchema.set("timestamps" , true);

module.exports = mongoose.model("result", resultSchema);
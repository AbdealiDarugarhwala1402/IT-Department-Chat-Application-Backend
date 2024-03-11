const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentName : {
        type: String,
        require : true,
    },
    studentEnrollmentNo : {
        type: String,
        require : true,
    },
    studentPassword : {
        type: String,
        require : true,
    },
    studentEmail : {
        type : String,
    },
    studentProfilePic:{
        type: String,
    },
    isActive: {
        type: String,
        default: true,
      },
    });
    studentSchema.set("timestamps", true);
    
    module.exports = mongoose.model("student", studentSchema);

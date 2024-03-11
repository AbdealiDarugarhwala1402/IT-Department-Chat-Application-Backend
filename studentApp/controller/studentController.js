const bcrypt = require("bcrypt");
const studentSchema = require("../../model/studentSchema");
const jwt = require("jsonwebtoken");
const { unlinkSync } = require("fs");

module.exports = {
    studentSignUp: async (req, res) => {
        const salt = await bcrypt.genSalt(10);
        const studentData = new studentSchema(req.body);
        try {
            const isStudentExist = await studentSchema.findOne({
                studentEnrollmentNo : req.body.studentEnrollmentNo
            });
            if (isStudentExist) {
                res.status(409).json({
                    success: false,
                    message: "Student is already registered with this enrollment number",
                });
            } else {
                studentData.studentPassword = await bcrypt.hash(req.body.studentPassword, salt);
                const student = await studentData.save();
                res.status(201).json({
                    success: true,
                    message: "Student successfully registered",
                    student: student,
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Error occur ${error.message}`,
            });
        }
    },
}


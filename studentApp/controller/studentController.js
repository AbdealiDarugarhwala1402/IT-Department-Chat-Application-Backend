const bcrypt = require("bcrypt");
const studentSchema = require("../../model/studentSchema");
const jwt = require("jsonwebtoken");
const { transporter } = require("../../services/emailServices");
const { unlinkSync } = require("fs");

module.exports = {
    studentSignUp: async (req, res) => {
        const salt = await bcrypt.genSalt(10);
        const studentData = new studentSchema(req.body);
        try {
            const isStudentExist = await studentSchema.findOne({
                studentEnrollmentNo: req.body.studentEnrollmentNo
            });
            if (isStudentExist) {
                res.status(409).json({
                    success: false,
                    message: "Student is already registered with this enrollment number",
                });
            } else {
                studentData.studentPassword = await bcrypt.hash(req.body.studentPassword, salt);
                studentData.studentEmail = `${studentData.studentEnrollmentNo}@medicaps.ac.in`;
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

    studentLogin: async (req, res) => {
        try {
            const studentData = await studentSchema.findOne({
                studentEnrollmentNo: req.body.studentEnrollmentNo,
            });
            if (studentData) {
                const hashPassword = await bcrypt.compare(
                    req.body.studentPassword,
                    studentData.studentPassword
                );
                if (studentData && hashPassword) {
                    const secret = studentData._id + process.env.SECRET_KEY;
                    const token = jwt.sign({ studentID: studentData._id }, secret, { expiresIn: "20m" });
                    res.status(200).json({
                        success: true,
                        message: "Login successfully",
                        token: token,
                        studentID: studentData._id
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        message: "Invalid student email or password",
                    });
                }
            } else {
                res.status(403).json({
                    success: false,
                    message: "Student is not registered with this email",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Error occur ${error.message}`,
            });
        }
    },

    sendMailToResetPassword: async (req, res) => {
        const { studentEmail } = req.body;
        try {
            const studentData = await studentSchema.findOne({ studentEmail });
            if (studentData) {
                const secret = studentData._id + process.env.SECRET_KEY;
                const token = jwt.sign({ studentID: studentData._id }, secret, { expiresIn: "20m" });
                const link = `http://127.0.0.1:3000/user/reset-password/${studentData._id}/${token}`;
                let info = await transporter.sendMail({
                    from: "miniprojectmu@gmail.com",
                    to: studentEmail,
                    subject: "Email for user reset Password",
                    html: `<a href="${link}">Click here to reset your password</a>`,
                });
                return res.status(200).json({
                    success: true,
                    message: "Email sent successfully",
                    token: token,
                    studentID: studentData._id,
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Please enter a valid email",
                });
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Error occurred: ${error.message}`,
            });
        }
    },

    forgetPasswordReset: async (req, res) => {
        const { id, token } = req.params;
        const { newPassword, confirmPassword } = req.body;
        try {
            const checkStudent = await studentSchema.findById(id);
            if (!checkStudent) {
                return res.status(404).json({
                    success: false,
                    error: "Student with the provided ID not found.",
                });
            }
            const secret = checkStudent._id + process.env.SECRET_KEY;
            try {
                jwt.verify(token, secret);
            } catch (err) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid or expired token.",
                });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    error: "Password and confirm password do not match.",
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await studentSchema.findByIdAndUpdate(checkStudent._id, {
                $set: { studentPassword: hashedPassword },
            });
            return res.status(200).json({
                success: true,
                message: "Password updated successfully.",
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    },

    updateStudentData: async (req, res) => {
        try {
            const studentId = req.params.id;
            const newProfilePic = req.file ? `/uploads/studentUploads${req.file.filename}` : undefined;
            const updatedStudent = await employeeSchema.findByIdAndUpdate(
                studentId,
                {
                    studentProfilePic: newProfilePic,
                },
                { new: true }
            );

            if (!updatedStudent) {
                return res.status(404).json({
                    success: false,
                    message: "Student not found",
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Student data updated successfully ✔",
                    user: updatedStudent
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                message: `Error occurred: ${err}`
            });
        }
    },

    resetPassword: async (req, res) => {
        const { id, token } = req.params;
        let { oldPassword, newPassword, confirmPassword } = req.body;
        try {
            let checkStudent = await studentSchema.findById(id)
            let hashPassword = await bcrypt.compare(
                oldPassword,
                checkStudent.studentPassword
            );
            if (hashPassword) {
                if (newPassword === confirmPassword) {
                    const salt = await bcrypt.genSalt(10);
                    const bcryptPassword = await bcrypt.hash(confirmPassword, salt);
                    await studentSchema.findByIdAndUpdate(checkStudent._id, {
                        $set: { studentPassword: bcryptPassword },
                    });
                    res.status(200).json({
                        success: true,
                        message: "Password updated successfully ✔",
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        error: "Password and confirm password do not match!!"
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    error: "Old password do not match!!!"
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                error: err.message,
            });
        }
    }

}

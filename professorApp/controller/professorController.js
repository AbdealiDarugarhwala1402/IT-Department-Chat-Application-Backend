const professorSchema = require("../../model/professorSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { transporter } = require("../../services/emailServices");
const { unlinkSync } = require("fs");

module.exports = {
    professorSignUp: async (req, res) => {
        const salt = await bcrypt.genSalt(10);
        const professorData = new professorSchema(req.body);
        try {
            const isProfessorExist = await professorSchema.findOne({
                professorEmail: req.body.professorEmail
            });
            if (isProfessorExist) {
                res.status(409).json({
                    success: false,
                    message: "Professor is already registered with this email address",
                });
            } else {
                professorData.professorPassword = await bcrypt.hash(req.body.professorPassword, salt);
                const professor = await professorData.save();
                res.status(201).json({
                    success: true,
                    message: "Professor successfully registered",
                    professor: professor,
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Error occur ${error.message}`,
            });
        }
    },

    professorLogin: async (req, res) => {
        try {
            const professorData = await professorSchema.findOne({
                professorEmail: req.body.professorEmail,
            });
            if (professorData) {
                const hashPassword = await bcrypt.compare(
                    req.body.professorPassword,
                    professorData.professorPassword
                );
                if (hashPassword) {
                    const secret = professorData._id + process.env.SECRET_KEY;
                    const token = jwt.sign({ professorID: professorData._id }, secret, { expiresIn: "1h" });
                    res.status(200).json({
                        success: true,
                        message: "Login successful",
                        token: token,
                        professorID: professorData._id
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        message: "Invalid professor email or password",
                    });
                }
            } else {
                res.status(403).json({
                    success: false,
                    message: "Professor is not registered with this email",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `An error occurred: ${error.message}`,
            });
        }
    },

    sendMailToResetPassword: async (req, res) => {
        const { professorEmail } = req.body;
        try {
            const professorData = await professorSchema.findOne({ professorEmail });
            if (professorData) {
                const secret = professorData._id + process.env.SECRET_KEY;
                const token = jwt.sign({ professorID: professorData._id }, secret, { expiresIn: "20m" });
                const link = `http://127.0.0.1:3000/user/reset-password/${professorData._id}/${token}`;
                let info = await transporter.sendMail({
                    from: "miniprojectmu@gmail.com",
                    to: professorEmail,
                    subject: "Email for user reset Password",
                    html: `<a href="${link}">Click here to reset your password</a>`,
                });
                return res.status(200).json({
                    success: true,
                    message: "Email sent successfully",
                    token: token,
                    professorID: professorData._id,
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
            const checkProfessor = await professorSchema.findById(id);
            if (!checkProfessor) {
                return res.status(404).json({
                    success: false,
                    error: "Professor with the provided ID not found.",
                });
            }
            const secret = checkProfessor._id + process.env.SECRET_KEY;
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
            await professorSchema.findByIdAndUpdate(checkProfessor._id, {
                $set: { professorPassword: hashedPassword },
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

    updateProfessorData: async (req, res) => {
        try {
            const professorId = req.params.id;
            const newProfilePic = req.file ? `/uploads/professorUploads${req.file.filename}` : undefined;
            const newDescription = req.body.professorDescription ? `${req.body.professorDescription}` : undefined;
            const newRole = req.body.professorRole ? `${req.body.professorRole}` : undefined;

            console.log("New Role:", newRole); // Add logging statement

            const updatedProfessor = await professorSchema.findByIdAndUpdate(
                professorId,
                {
                    professorProfilePic: newProfilePic,
                    professorDescription: newDescription,
                    professorRole: newRole,
                },
                { new: true }
            );

            console.log("Updated Professor:", updatedProfessor); // Add logging statement

            if (!updatedProfessor) {
                return res.status(404).json({
                    success: false,
                    message: "Professor not found",
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Professor data updated successfully",
                    user: updatedProfessor
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
            let checkProfessor = await professorSchema.findById(id)
            let hashPassword = await bcrypt.compare(
                oldPassword,
                checkProfessor.professorPassword
            );
            if (hashPassword) {
                if (newPassword === confirmPassword) {
                    const salt = await bcrypt.genSalt(10);
                    const bcryptPassword = await bcrypt.hash(confirmPassword, salt);
                    await professorSchema.findByIdAndUpdate(checkProfessor._id, {
                        $set: { professoorPassword: bcryptPassword },
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

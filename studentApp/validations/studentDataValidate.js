const studentValSchema = require("./studentValSchema");
const { unlinkSync } = require("fs");


module.exports = {
    registerStudentValidation: async (req, res, next) => {
        try {
            const value = await studentValSchema.registerStudent.validate(req.body, { abortEarly: false });
            if (value.error) {
                res.status(403).json({
                    success: false,
                    // message: value.error.details[0].message
                });
            } else {
                req.file ? unlinkSync(req.file.path) : null;
                next();
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Error occurred: ${error.message}`
            });
        }
    },
    

    // loginUserValidation: async (req, res, next) => {
    //     const value = await userValSchema.loginUser.validate(req.body, { abortEarly: false })
    //     if (value.error) {
    //         res.status(403).json({
    //             success: false,
    //             message: value.error.details[0].message
    //         })
    //     } else {
    //         next()
    //     }
    // },

    // resetPasswordValidation: async (req, res, next) => {
    //     const value = await userValSchema.resetPassword.validate(req.body, { abortEarly: false })
    //     if (value.error) {
    //         res.status(403).json({
    //             success: false,
    //             message: value.error.details[0].message
    //         })
    //     } else {
    //         next()
    //     }
    // },
}
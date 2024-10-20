const professorValSchema = require("./professorValSchema");
const { unlinkSync } = require("fs");


module.exports = {
    registerProfessorValidation: async (req, res, next) => {
        try {
            const value = await professorValSchema.registerProfessor.validate(req.body, { abortEarly: false });
            if (value.error) {
                const errorMessage = value.error.details[0] ? value.error.details[0].message : "Unknown error occurred";
                res.status(403).json({
                    success: false,
                    message: errorMessage
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
    }
}
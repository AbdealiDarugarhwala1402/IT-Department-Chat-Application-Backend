const joi = require("joi")
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);


const studentSchema = {
    registerStudent: joi.object({
        studentName: joi.string()
            .min(3)
            .max(20)
            .message({
                "string.min": "{#label} should contain at least {#limit} characters",
                "string.max": "{#label} should contain at most {#limit} characters",
            })
            .required(),
    
        studentEnrollmentNo: joi.string()
            .regex(/^en\d{2}it301\d{3}$/)
            .required()
            .error(new Error('Student enrollment number is invalid. It should be in the format "enXXit301YYY".')),
    
        studentPassword: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(3)
            .minOfUppercase(1)
            .minOfNumeric(3)
            .noWhiteSpaces()
            .onlyLatinCharacters()
            .messages({
                'password.minOfUppercase': '{#label} should contain at least {#min} uppercase character',
                'password.minOfSpecialCharacters': '{#label} should contain at least {#min} special character',
                'password.minOfLowercase': '{#label} should contain at least {#min} lowercase character',
                'password.minOfNumeric': '{#label} should contain at least {#min} numeric character',
                'password.noWhiteSpaces': '{#label} should not contain white spaces',
                'password.onlyLatinCharacters': '{#label} should contain only Latin characters',
            }),
    
        studentEmail: joi.string()
            .email()
            .required(),
    }),
    
}

module.exports = studentSchema;
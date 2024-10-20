let express = require("express");
let student = require("../controller/studentController");
const { registerStudentValidation } = require("../validations/studentDataValidate");

let router = express.Router();

router.post("/signup", registerStudentValidation, student.studentSignUp);
router.post("/login", student.studentLogin);
router.post("/sendmail", student.sendMailToResetPassword);
router.patch("/forgetpasswordreset/:id/:token", student.forgetPasswordReset);
router.patch("/updateprofile/:id", student.updateStudentData);
router.patch("/passwordreset/:id/:token", student.resetPassword);

module.exports = router;
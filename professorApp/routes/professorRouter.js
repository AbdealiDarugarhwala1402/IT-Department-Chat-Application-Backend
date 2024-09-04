let express = require("express");
let professor = require("../controller/professorController");
const { registerProfessorValidation } = require("../validations/professorDataValdiate");

let router = express.Router();

router.post("/signup", registerProfessorValidation, professor.professorSignUp);
router.post("/login",professor.professorLogin);
router.post("/sendmail", professor.sendMailToResetPassword);
router.patch("/forgetpassword/:id/:token", professor.forgetPasswordReset);
router.patch("/updateprofile/:id", professor.updateProfessorData);
router.patch("/resetpassword/:id/:token", professor.resetPassword);

module.exports = router;

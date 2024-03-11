let express = require("express");
let student = require("../controller/studentController");
const {registerStudentValidation} = require("../validations/studentDataValidate");

let router = express.Router();

router.post("/signup",registerStudentValidation, student.studentSignUp);

module.exports = router;
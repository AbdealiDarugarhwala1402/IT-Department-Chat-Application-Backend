let express = require('express');
let studentRouter = require('./studentApp/routes/studentRouter');
let achievementRouter = require('./studentApp/routes/achievementRouter');
let professorRouter = require("./professorApp/routes/professorRouter");
let resultRouter = require("./professorApp/controller/resultController");
let chatController = require('./chatApp/chatController');

let commonRouter = express.Router();

commonRouter.use('/student', studentRouter);
commonRouter.use('/achievement', achievementRouter);
commonRouter.use('/professor',professorRouter);
commonRouter.use('/result', resultRouter);
commonRouter.use('/chat', chatController);

module.exports = commonRouter;

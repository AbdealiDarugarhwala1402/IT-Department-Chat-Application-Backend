const express =  require('express');
const achievement = require('../controller/achievementController');

const router =  express.Router();

router.post("/addachievement/:id", achievement.addAchievement);

module.exports = router;
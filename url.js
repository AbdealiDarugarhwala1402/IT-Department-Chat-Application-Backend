let express = require('express')
let studentRouter = require('./studentApp/routes/studentRouter')

let commonRouter = express.Router()

commonRouter.use('/student', studentRouter)

module.exports = commonRouter
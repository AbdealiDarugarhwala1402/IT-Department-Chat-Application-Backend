let Express = require('express');
require("dotenv").config();
require('./config/modelConfig');
const commonRouter = require('./url');
const PORT = process.env.PORT || 5000;
const HOST = "localhost";

let app = Express();

app.use(Express.json())
app.use('/', commonRouter)


const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port number : ${process.env.PORT}`)
})

module.exports = server

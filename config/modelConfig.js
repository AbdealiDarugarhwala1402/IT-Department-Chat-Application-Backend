const mongoose = require("mongoose");

mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
});

mongoose.connection.on("connected", (req,res)=>{
    console.log("mongoose is connected");
});

mongoose.connection.on("error", (err)=>{
    console.log("mongoose connection error", err);
});
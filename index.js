//app create
const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;
//cookie parser 
const cookieParser=require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
//middle ware to upload file
const fileupload=require("express-fileupload");
app.use(fileupload({ 
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
//connect to db
require("./config/database").connect();
//connect to cloudinary
require("./config/cloudinary").cloudinaryConnect();
//route import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

//activate

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})
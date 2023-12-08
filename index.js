
//app create
const express = require("express");
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
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
app.use( user);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//activate

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { auth } = require("../middlewares/auth");

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
    },
    tags: {
        type: String,
    },
    email: {
        type: String,
    },
    type: {
        type: String,
    }
});

//post middleware
fileSchema.post("save",async function(doc){
    try {
        console.log("doc",doc);
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        });
        //send mail
        let info= await transporter.sendMail({
            from:`zaynatic`,
            to:doc.email,
            subject:"new file uploaded",
            html:`<h2>hello ji</h2><p>file uploaded View here: <a href="${doc.url}">${doc.url}</a></p>`
        })
        console.log(info);
    } catch (error) {
        console.log(error);
    }
})

const FileModel = mongoose.model("File", fileSchema);
module.exports = FileModel;
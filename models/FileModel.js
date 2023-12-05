const mongoose = require("mongoose");
//const nodemailer = require('../config/nodemailer');

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

const FileModel = mongoose.model("File", fileSchema);
module.exports = FileModel;
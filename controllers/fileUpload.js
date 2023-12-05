const FileModel=require("../models/FileModel");
const cloudinary=require("cloudinary").v2;
const jwt = require("jsonwebtoken");
//localfileupload -> handler function
exports.localFileUpload=async(req,res)=>{
    try {
        //fetch filefrom request
        const file=req.files.file;
        console.log("file aagayi",file);
        //create path where file need to be stored on server
        let path=__dirname+"/files/"+Date.now()+`.${file.name.split('.')[1]}`;
        console.log(path);
        //add path to the move function
        file.mv(path,(err)=>{
            console.log(err);
        })

        res.json({
            sucess:true,
            message:'local file uploaded sucessfully'
        })
    } catch (error) {
        console.log(error)
    }
}
function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}
async function uploadFileToCloudinary(file,folder,quality){
    const options={folder};
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto"
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}
//image upload handler
exports.imageUpload=async(req,res)=>{
    try {
        const{name,tags,email}=req.body;
        //console.log(name,tags,email);
        const file=req.files.imageFile;
        //console.log(file);
        //validation 
        const supportedTypes=["jpg","jpeg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                sucess:false,
                message:'File format not supported',
            })
        }
        //file supported hia toh
        const response=await uploadFileToCloudinary(file,"zaynatic");
        //save in db
        const fileData=await FileModel.create({
            name,
            tags,
            email,
            url:response.secure_url,
            type:response.resource_type,
        });
        res.json({
            sucess:true,
            imageUrl:response.secure_url,
            message:'image sucessfully upload to cloudinary'
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            sucess:false,
            message:"failed to upload image"
        })
    }
}
// Video Uploader Handler 
exports.videoUpload = async (req, res) => {
    try {
        // Fetch Data 
        const { name, tags, email } = req.body;
     
        const videoFile = req.files.videoFile;

        // Validation 
        const supportedTypes = ["mp4", "mov"];
        const fileType = videoFile.name.split(".")[1].toLowerCase();
        console.log(fileType);

        // HW - File Maximum 5MB
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            res.status(400).json({
                success: false,
                message: "File type not supported"
            })
        }
       
        // Supported 
        // File Upload to the Cloudinary 
        const response = await uploadFileToCloudinary(videoFile, "zaynatic");

        console.log(response)

        // Upload To DB
        //save in db
        const fileData=await FileModel.create({
            name,
            tags,
            email,
            url:response.secure_url,
            type:response.resource_type,
        });

        //console.log("file",file);
        console.log(response.secure_url)
        res.status(200).json({
            success: true,
            videoUrl:response.secure_url,
            message: "video file uploaded successfully"
            
       })
    }
    catch (err) {
        console.error(err)
        res.status(400).json({
            success: false,
            message: "Something went wrong"
        })
    }
}
//compress file size upload
exports.imageReducer = async (req, res) => {
    try {

        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        // Fetch file 
        const imageFile = req.files.imageFile;
        console.log(imageFile);

        const supportedTypes = ["png", "jpg", "jpeg"];
        const fileType = imageFile.name.split('.')[1].toLowerCase();

        // Check file type is supported or not 
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File type not supported"
            })
        }

        // Upload to Cloudinary
        // HW - Decrease size by height and width 
        const response = await uploadFileToCloudinary(imageFile, "zaynatic", 50);
        console.log(response)


        // Upload to DB 
        const fileData = await FileModel.create({
            name,
            tags,
            email,
            url: response.secure_url,
            type:response.resource_type,
        })


        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            file: fileData
        })

    }
    catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Something went wrong"
        })
    }
}
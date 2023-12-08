const express = require("express");
const router = express.Router();

const{login,signup}=require("../controllers/Auth");
const{auth,isStudent,isAdmin}=require("../middlewares/auth");
const{localFileUpload,imageUpload,videoUpload,imageReducer}=require("../controllers/fileUpload")
//imageUpload,videoUpload,imageReducerUpload,
// router.post("/login",login);
router.post("/signup",signup);
router.post("/login",login);
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        Message:'welcome to the protected route for test',
    });
})
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        Message:'welcome to the protected route for students',
    });
});
router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        Message:'welcome to the protected route for admin',
    });
});
//route to upload loacal file
router.post("/localFileUpload",auth,localFileUpload);
router.post("/imageUpload",auth,isStudent,imageUpload);
router.post("/videoUpload",videoUpload);
router.post("/imageReducer", imageReducer);
module.exports=router;
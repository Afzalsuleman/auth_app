//auth,isStudent,isAdmin
const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req,res,next)=>{
    try {
        //extract jwt token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                success:false,
                Message:'Token missing',
            });
        }
        //verify the token
        try {
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            req.user=payload;
        } catch (error) {
            return res.status(402).json({
                success:false,
                Message:'Token is invalid',
            });
        }
        next();
    } catch (error) {
        return res.status(403).json({
            success:false,
            Message:'Some thing went wrong, while verifying the token',
        });
    }
}

exports.isStudent = (req,res,next) => {
    try{
            if(req.user.role !== "Student") {
                return res.status(401).json({
                    success:false,
                    message:'THis is a protected route for students',
                });
            }
            next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}
exports.isAdmin=(req,res,next)=>{
    try {
        if(req.body.role!=="admin"){
            return res.status(401).json({
                success:false,
                Message:'This is protected route for Admin only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            Message:'User role not matching',
        });
    }
}
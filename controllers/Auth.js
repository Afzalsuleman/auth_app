const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { options } = require("../routes/user");
//const { options } = require("../routes/user");
require("dotenv").config();


//signup route handler
exports.signup = async (req,res) => {
    try{
        //get data
        const {name, email, password, role} = req.body;
        //check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:'Error inn hashing Password',
            });
        }

        //create entry for User
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:'User Created Successfully',
        });

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });
    }
}

//login
exports.login=async(req,res)=>{
    try {
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: 'Please fill all the details carefully'
            });  
        }
        //check for registered user
        let user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message: 'user not registered'
            });  
        }
        const payload={
            email:user.email,
            id:user._id,
            role:user.role
        }
        //verify password and generate a jwt token
        if(await bcrypt.compare(password,user.password)){
            //password match
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                });
                user = user.toObject();
                user.token = token;
                user.password = undefined;
        const options={
            expiresIn:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:'User loged in sucessfully',
        })

        }else{
            return res.status(403).json({
                success:false,
                message: 'Password missmatch'
            }); 
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"login failure",
        });
    }
}
const User = require("../models/user");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mailSender = require('../utils/mailSender');
const { resetPasswordTemplate } = require("../mailTemplates.js/resetPasswordTemplate");

//resetPasswordToken
exports.resetPasswordToken = async (req , res) => {

    try{

        const {email} = req.body;

        if(!email){
            return res.status(403).json({
                success: false,
                message: "Please provide with the valid email to reset the password"
            })
        }

        const user = await User.findOne({email:email});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User does not exists for the email"
            })
        }

        const token = crypto.randomBytes(20).toString('hex');

        await User.findOneAndUpdate({email:email} , {token:token , resetPasswordExpires: Date.now() + 5*60*1000} , {new:true});

        const url = `https://quick-talk-two.vercel.app/update-password/${token}`;

        await mailSender(email , "Request to Reset Password" , resetPasswordTemplate(url , `${user.firstName}`));

        res.status(200).json({
            success: true,
            message: "Email sent Successfully!"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to generate token for resetting the password"
        })
    }
}

//resetPassword
exports.resetPassword = async (req , res) => {

    try{

        const {newPassword , confirmNewPassword , token} = req.body;

        console.log(newPassword)
        if(!newPassword || !confirmNewPassword || !token){
            return res.status(403).json({
                success: false,
                message: "Please provide with the required fields"
            })
        }

        if(newPassword !== confirmNewPassword){
            return res.status(403).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        const user = await User.findOne({token:token});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Token is invalid"
            })
        }

        if(user.resetPasswordExpires < Date.now()){
            return res.status(403).json({
                success: false,
                message: "Token is expired"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10);

        await User.findOneAndUpdate({token:token} , {password:hashedPassword} , {new:true});

        res.status(200).json({
            success: true,
            message: "Password is Updated Successfully"
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to reset password"
        })
    }
}
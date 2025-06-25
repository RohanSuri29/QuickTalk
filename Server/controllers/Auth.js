const {validationResult} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redis');
const Project = require('../models/project');
const axios = require('axios');
const Msges = require('../models/messages');

require('dotenv').config();

//SignUp Handler
exports.registerHandler = async (req , res) => {

    try{

        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(403).json({
                error: error.array()
            })
        }

        const {firstName , lastName  , email , password , confirmPassword} = req.body;

        if(!firstName || !email || !password || !confirmPassword){
            return res.status(403).json({
                success: false,
                message: "Please provide with required fields"
            })
        }

        if(password !== confirmPassword){
            return res.status(403).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(403).json({
                success: false,
                message: "User already exists"
            })
        }

        let hashedPassword;
        try{

            hashedPassword = await bcrypt.hash(password , 10);

            //chat gpt code don't need to understand
            const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firstName + ' ' + lastName)}`;
            const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
            const base64Avatar = `data:image/svg+xml;base64,${Buffer.from(avatarResponse.data).toString('base64')}`;


            const newUser = await User.create({firstName , lastName , email , password:hashedPassword , image:base64Avatar});

            if(newUser){

                const payload = {
                    id: newUser._id,
                    email: newUser.email
                }

                const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn:"24h"});
                newUser.token = token;

                const options = {
                    httpOnly: true,
                    expires: new Date(Date.now() + 3*24*60*60*1000)
                }

                res.cookie("token" , token , options).status(200).json({
                    success: true,
                    user: newUser,
                    token: token,
                    message: "User Signed up Successfully!"
                })
            }
        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Unable to hash password"
            })
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to signup for the user"
        })

    }
}

//Login Handler
exports.loginHandler = async(req , res) => {

    try{

        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(403).json({
                error: error.array()
            })
        }

        const {email , password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Please provide with the required details"
            })
        }

        const user = await User.findOne({email}).select('+password');

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User is not registered"
            })
        }

        if(await bcrypt.compare(password , user.password)){

            const payload = {
                id: user._id,
                email: user.email
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET , {expiresIn:"24h"});
            user.token = token;
            user.password = undefined;

            const options = {
                httpOnly: true,
                expires: new Date(Date.now() + 3*24*60*60*1000)
            }

            res.cookie("token" , token , options).status(200).json({
                success: true,
                user: user,
                token: token,
                message: "User logged In Successfully!"
            })
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to login"
        })
    }
}

//profile handler
exports.profileHandler = async(req , res) => {

    try{

        const id = req.user.id;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Unable to find user for the id"
            })
        }

        res.status(200).json({
            success: true,
            data: user,
            message: "User data fetched Successfully!"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to get user data"
        })
    }
}

//logout Handler
exports.logoutHandler = async(req , res) => {

    try{

        res.clearCookie('token');

        const token = req?.body?.token || req?.cookies?.token || req?.header('Authorization').replace('Bearer ' , '');

        if(!token){
            return res.status(404).json({
                success: false,
                message: "Token is missing"
            })
        }

        redisClient.set(token , 'logout' , 'EX' , 24*60*60);

        res.status(200).json({
            success: true,
            message: "Logged Out Successfully!"
        })
        
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to Log out"
        })
    }
}

//getAllUsers
exports.getAllUsers = async (req , res) => {

    try{

        const {projectId} = req.body;

        if(!projectId){
            return res.status(403).json({
                success: false,
                message: "Please provide with the projectId"
            })
        }

        const project = await Project.findById(projectId);

        if(!project){
            return res.status(404).json({
                success: false,
                message: "Unable to find project for the id"
            })
        }

        const allUsers = await User.find({projects:{$ne:projectId}});

        res.status(200).json({
            success: true,
            data: allUsers,
            message: "Users fetched Successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch users"
        })
    }
}

//delete account
exports.deleteAccount = async (req , res) => {

    try{

        const userId = req.user.id;

        if(!userId) {
            return res.status(403).json({
                success: false,
                message: "Please provide with user id"
            })
        }

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Unable to find user for the id"
            })
        }

        for (const projectId of user.projects) {

            const updatedProject = await Project.findByIdAndUpdate(projectId , {$pull:{users:userId}} , {new:true});

            if(updatedProject.users.length === 0){
                await Project.findByIdAndDelete(projectId);
                await Msges.findOneAndDelete({projectId:projectId});
            }
        }


        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete account"
        })
    }
}
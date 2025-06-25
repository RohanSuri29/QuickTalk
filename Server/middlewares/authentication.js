const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redis');
require('dotenv').config();

exports.authentication = async (req , res , next) => {

    try{

        const token = req?.body?.token || req?.cookies?.token || req?.header('Authorization').replace('Bearer ' , "");

        if(!token){
            return res.status(404).json({
                success: false,
                message: "Token is missing"
            })
        }

        const isBlacklisted = await redisClient.get(token);

        if(isBlacklisted){
            return res.status(403).json({
                success: false,
                message: "Token is Invalid"
            })
        }

        try{

            const decode = jwt.verify(token , process.env.JWT_SECRET);
            req.user = decode;

        }
        catch(error){
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Unable to decode token"
            })
        }

        next();
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to authenticate user"
        })
    }
    
}
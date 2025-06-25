const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email , title , body) => {

    try{

        let transporter = nodemailer.createTransport({

            host: process.env.Mail_Host,
            port: 465,
            secure: true,
            auth:{
                user: process.env.Mail_User,
                pass: process.env.Mail_Pass
            }
        })

        let info = await transporter.sendMail({
            from: "QuickTalk",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        return info
    }
    catch(error){
        console.error(error);
    }
}

module.exports = mailSender;
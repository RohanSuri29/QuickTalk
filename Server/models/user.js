const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        minLength: [6, 'email must be 6 characters long'],
        maxLength: [50 , 'email must be less than 50 characters']
    },
    password:{
        type: String,
        select: false
    },
    token:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    },
    image:{
        type: String
    },
    projects:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }]
})

module.exports = mongoose.model("User" , userSchema);
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    fileTree:{
        type: Object,
        default: {}
    }
})

module.exports = mongoose.model('Project' , projectSchema);
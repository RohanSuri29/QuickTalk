const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Project'
    },
    msges:[
        {
            sender:{
                type: Object
            },
            message:{
                type: String
            }
        }
    ]
})

module.exports = mongoose.model('Msges' , messageSchema);
const Msges = require("../models/messages");
const Project = require("../models/project");

exports.getMessages = async (req , res) => {

    try{
        
        const {projectId} = req.body;

        if(!projectId){
            return res.status(403).json({
                success: false,
                message: "Please provide with the project id"
            })
        }

        const project = await Project.findById(projectId);

        if(!project){
            return res.status(404).json({
                success: false,
                message: "Unable to find project for the project id"
            })
        }

        const result = await Msges.findOne({projectId:projectId});

        if(!result){
            return res.status(404).json({
                success: false,
                message: "Unable to find the messages array for the project id"
            })
        }

        res.status(200).json({
            success: true,
            data: result?.msges,
            message: "Messages found Successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to find messages array"
        })
    }

}
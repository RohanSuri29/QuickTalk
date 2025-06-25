const { validationResult } = require("express-validator");
const Project = require("../models/project");
const User = require("../models/user");
const { json } = require("express");
const { default: mongoose } = require("mongoose");
const Msges = require("../models/messages");

//create Project
exports.createProject = async (req , res) => {

    try{
        
        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(403).json({
                error: error.array()
            })
        }

        const {name} = req.body;
        const userId = req.user.id;
      
        if(!name) {
            return res.status(403).json({
                success: false,
                message: "Please provide with the required fields"
            })
        }

        const existingProject = await Project.findOne({name:name , users:[userId]});

        if(existingProject){
            return res.status(403).json({
                success: false,
                message: "Project with the name already exists"
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Unable to find user for the id"
            })
        }

        const newProject = await Project.create({name , users:[userId]});

        await User.findByIdAndUpdate(userId , {$push:{projects:newProject._id}} , {new:true});

        await Msges.create({projectId:newProject._id , msges:[]});

        res.status(200).json({
            success: true,
            data: newProject,
            message: "Project created Successfully!"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to create project"
        })
    }
}

//get all projects
exports.getAllProjects = async (req , res) => {

    try{

        const userId = req.user.id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success:" false",
                message: "Unable to find user for the id"
            })
        }

        const projects = await Project.find({users: userId});

        res.status(200).json({
            success: true,
            data: projects,
            message: "Projects fetched Successfully"
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to get projects for the id"
        })
    }
}

//get project
exports.getProject = async (req , res) => {

    try{

        const {projectId} = req.body;

        if(!projectId){
            return res.status(403),json({
                success: false,
                message: "Please provide with the required fields"
            })
        }

        const project = await Project.findById(projectId).populate('users');

        if(!project){
            return res.status(404).json({
                success: true,
                message: "Unable to find project for the projectId"
            })
        }

        res.status(200).json({
            success: true,
            data: project,
            message: "Project fetched Successfully"
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch project for the id"
        })
    }
}

//add user to project
exports.addUserToProject = async (req , res) => {

    try{

        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(403).json({
                error: error.array()
            })
        }

        const {projectId , users} = req.body;
        const userId = req.user.id;

        if(!projectId || users.length === 0){
            return res.status(403).json({
                success: false,
                message: "Please provide with the required details"
            })
        }

        const existingUser = await User.findById(userId);

        if(!existingUser){
            return res.status(404).json({
                success: false,
                message: "Unable to find user for the id"
            })
        }

        const existingProject = await Project.findOneAndUpdate({_id:projectId , users:userId} , {$addToSet:{users:{$each:users}}} , {new: true}).populate("users");

        if(!existingProject){
            return res.status(404).json({
                success: false,
                message: "User is not added in the project"
            })
        }

        for (const id of users){
            await User.findByIdAndUpdate(id , {$push:{projects:projectId}} , {new:true});
        }

        res.status(200).json({
            success: true,
            data: existingProject,
            message: "Users added Successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to add user to the project"
        })
    }

}

//delete project
exports.deleteProject = async (req , res) => {

    try{

        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(403).json({
                error: error.array()
            })
        }

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
                message: "Unable to find project for the id"
            })
        }

        for(const id of project?.users){
            await User.findByIdAndUpdate(id , {$pull:{projects:projectId}} , {new: true})
        }

        await Msges.findOneAndDelete({projectId:projectId});

        await Project.findByIdAndDelete(projectId);

        res.status(200).json({
            success: true,
            message: "Project deleted Successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete project"
        })
    }
}

//update file tree
exports.updateFileTree = async (req , res) => {

    try{

        const error = validationResult(req);

        if(!error.isEmpty()){
            return res.status(403).json({
                error: error.array()
            })
        }

        const {projectId , fileTree} = req.body;

        if(!projectId , !fileTree) {
            return res.status(403).json({
                success: false,
                message: "Please provide with the required fields"
            })
        }

        const project = await Project.findByIdAndUpdate(projectId , {fileTree:fileTree} , {new:true});

        if(!project){
            return res.status(404).json({
                success: false,
                message: "Unable to find the peoject for the given id"
            })
        }

        res.status(200).json({
            success: true,
            message: "File tree updated successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to update file tree"
        })
    }
}
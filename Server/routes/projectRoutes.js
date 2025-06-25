const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authentication } = require('../middlewares/authentication');
const { createProject, getAllProjects, getProject, addUserToProject, deleteProject, updateFileTree } = require('../controllers/Project');
const { getMessages } = require('../controllers/Message');

router.post('/create' , body('name').isString().withMessage("Please provide with the name of the project") , authentication , createProject)
router.get('/getAllProjects' , authentication , getAllProjects);
router.post('/getProject' , authentication , getProject);
router.post('/delete' , body('projectId').isString().withMessage('Please provide with the projectId') , authentication , deleteProject);
router.post('/getMessages' , authentication , getMessages);
router.put('/update-fileTree' , [
    body('projectId').isString().withMessage("Please provide with the project id"),
    body('fileTree').isObject().withMessage("Please provide with the file tree")
] , authentication , updateFileTree)
router.post('/addUser' , [
    body('projectId').isString().withMessage("Please provide with the projectId"),
    body('users').isArray({min:1}).withMessage('Users should be an array of minimum length 1').bail()
    .custom((users) => users.every((user) => typeof user === 'string')).withMessage('User should be a string')
] , authentication , addUserToProject);

module.exports = router;
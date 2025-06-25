const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

const { registerHandler, loginHandler, profileHandler, logoutHandler, getAllUsers, deleteAccount } = require('../controllers/Auth');
const { resetPasswordToken, resetPassword } = require('../controllers/ResetPassword');
const { authentication } = require('../middlewares/authentication');

router.post('/signup' , [
    body('email').isEmail().withMessage('Invalid Email'),
    body('firstName').isLength({min:3}).withMessage('firstName should be of minimum length 3'),
    body('lastName').isLength({min:3}).withMessage('LastName should be of minimum length 3'),
    body('password').isLength({min:6}).withMessage('Password should be of minimum length 6')
] , registerHandler)

router.post('/login' , [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:6}).withMessage("Password should be of minimum length 6")
] , loginHandler)

router.post('/forgot-password' , resetPasswordToken)
router.post('/update-password' , resetPassword)
router.get('/getUser' , authentication , profileHandler)
router.get('/logout' , authentication , logoutHandler)
router.post('/getAllUsers' , authentication , getAllUsers)
router.delete('/delete' , authentication , deleteAccount)

module.exports = router
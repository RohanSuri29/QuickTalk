const express = require('express');
const { getResult } = require('../controllers/Gemini');
const { authentication } = require('../middlewares/authentication');
const router = express.Router();

router.post('/get-result' , authentication ,  getResult);

module.exports = router;
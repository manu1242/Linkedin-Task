const express = require('express');
const router = express.Router();
const { register, login ,GetByID} = require('../Controllers/authController');
const authMiddleware = require('../Middleware/Auth');

router.post('/register', register);
router.post('/login', login);
router.get('/getme',authMiddleware, GetByID);


module.exports = router;

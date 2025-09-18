const express = require('express');
const router = express.Router();
const { register, login ,GetByID} = require('../Controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/getme', GetByID);


module.exports = router;

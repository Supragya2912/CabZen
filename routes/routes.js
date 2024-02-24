const express = require('express');
const router = express.Router();

const Auth = require('../controllers/auth');

router.post('/registerUser', Auth.registerUser)
router.post('/login',Auth.loginUser)




module.exports = router;
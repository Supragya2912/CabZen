const express = require('express');
const router = express.Router();
const Auth = require('../controllers/auth');

router.post('/registerUser', Auth.registerUser)
router.post('/login', Auth.loginUser)
router.post('/forgotPassword', Auth.forgotPassword)
router.post('/resetPassword', Auth.resetPassword)
router.post('/user', Auth.protect, Auth.getUser)

module.exports = router;
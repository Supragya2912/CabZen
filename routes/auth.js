const express = require('express');
const router = express.Router();
const Auth = require('../controllers/auth');

router.post('/register-user', Auth.registerUser)
router.post('/login', Auth.loginUser)
router.post('/forgot-password', Auth.forgotPassword)
router.post('/reset-password', Auth.resetPassword)
router.post('/user', Auth.protect, Auth.getUser)
router.post('/updateUser', Auth.protect, Auth.updateUser)
router.post('/update-password', Auth.protect, Auth.updatePassword)

module.exports = router;
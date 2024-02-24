const express = require('express');
const router = express.Router();

const Auth = require('../controllers/auth');
const Admin = require('../controllers/admin');

router.post('/registerUser', Auth.registerUser)
router.post('/login',Auth.loginUser)

//admin routes
router.post('/getAllUsers', Admin.getAllUsers)
router.post('/addUser', Admin.addUser)
router.post('/updateUser', Admin.updateUser)


module.exports = router;
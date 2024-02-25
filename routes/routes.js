const express = require('express');
const router = express.Router();

const Auth = require('../controllers/auth');
const Admin = require('../controllers/admin');

router.post('/registerUser', Auth.registerUser)
router.post('/login',Auth.loginUser)

//admin routes 
// ----> user
router.post('/getAllUsers', Admin.getAllUsers)
router.post('/addUser', Admin.addUser)
router.post('/updateUser', Admin.updateUser)
router.post('/deleteUser', Admin.deleteUser)
// brand api
router.post('/addBrand', Admin.addBrand)
router.post('/getAllBrands', Admin.listAllBrands)
router.post('/updateBrand', Admin.updateBrand)
router.post('/deleteBrand', Admin.deleteUserBrand)
//cab api


module.exports = router;
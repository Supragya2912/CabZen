const express = require('express');
const router = express.Router();
const checkPermissions  = require('../middleware/aclpermission');
const Auth = require('../controllers/auth');
const Admin = require('../controllers/admin');
const Driver = require('../controllers/driver');
const User = require('../controllers/user');

router.post('/registerUser', Auth.registerUser)
router.post('/login', Auth.loginUser)

//admin routes 

// ----> user
router.post('/getAllUsers',Auth.protect, checkPermissions(["admin"]),Admin.getAllUsers)
router.post('/addUser',Auth.protect, checkPermissions(["admin"]), Admin.addUser)
router.post('/updateUser',Auth.protect, checkPermissions(["admin"]), Admin.updateUser)
router.post('/deleteUser',Auth.protect, checkPermissions(["admin"]), Admin.deleteUser)
// brand api
router.post('/addBrand',Auth.protect, checkPermissions(["admin"]), Admin.addBrand)
router.post('/listAllBrands',Auth.protect, checkPermissions(["admin"]), Admin.listAllBrands)
router.post('/updateBrand',Auth.protect, checkPermissions(["admin"]), Admin.updateBrand)
router.post('/deleteBrand', Auth.protect, checkPermissions(["admin"]),Admin.deleteUserBrand)
//cab api
router.post('/addCab',Auth.protect, checkPermissions(["admin"]), Admin.addCab)
router.post('/listAllCabs',Auth.protect, checkPermissions(["admin"]), Admin.listAllCabs)
router.post('/updateCab',Auth.protect, checkPermissions(["admin"]), Admin.updateCab)
router.post('/deleteCab', Auth.protect, checkPermissions(["admin"]),Admin.deleteCab)
//booking api
router.post('/getAllBooking',Auth.protect, checkPermissions(["admin"]), Admin.bookedCabs)
router.post('/bookedCabUser',Auth.protect, checkPermissions(["admin"]), Admin.bookedCabByUser)


// driver routes
router.post('/getAllBooking', Driver.getAllBooking)
router.post('/getOneBooking', Driver.getOneBooking)
router.post('/cancelBooking', Driver.cancelBooking)

//user routes
router.post('/getUserData', User.getUserData)
router.post('/bookCab', User.bookCab)
router.post('/cancelBooking', User.cancelBooking)
router.post('/history', User.getBookingHistoryByUser)



module.exports = router;
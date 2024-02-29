const express = require('express');
const router = express.Router();
const checkPermissions  = require('../middleware/aclpermission');
const Auth = require('../controllers/auth');
const Admin = require('../controllers/admin');
const Driver = require('../controllers/driver');
const User = require('../controllers/user');

router.post('/registerUser', Auth.registerUser)
router.post('/login', Auth.loginUser)
router.post('/forgotPassword', Auth.forgotPassword)
router.post('/resetPassword', Auth.resetPassword)

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
router.post('/getBookedCabs',Auth.protect, checkPermissions(["admin"]), Admin.bookedCabs)
router.post('/bookedCabUser',Auth.protect, checkPermissions(["admin"]), Admin.bookedCabByUser)


// driver routes
router.post('/getAllBooking',Auth.protect, checkPermissions(["driver"]), Driver.getAllBooking)
router.post('/getOneBooking', Auth.protect, checkPermissions(["driver"]),Driver.getOneBooking)
router.post('/cancelBooking',Auth.protect, checkPermissions(["driver"]), Driver.cancelBooking)

//user routes
router.post('/getUserData',Auth.protect, checkPermissions(["user"]) ,User.getUserData)
router.post('/bookCab', Auth.protect, checkPermissions(["user"]),User.bookCab)
router.post('/cancelBooking',Auth.protect,  checkPermissions(["user"]),User.cancelBooking)
router.post('/history',Auth.protect, checkPermissions(["user"]), User.getBookingHistoryByUser)



module.exports = router;
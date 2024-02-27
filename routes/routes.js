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
router.post('/addCab', Admin.addCab)
router.post('listAllCab', Admin.listAllCabs)
router.post('/updateCab', Admin.updateCab)
router.post('/deleteCab', Admin.deleteCab)
//booking api
router.post('/getAllBooking', Admin.bookedCabs)
router.post('/bookedCabUser', Admin.getOneBooking)


// driver routes
router.post('/getAllBooking', Admin.getAllBooking)
router.post('/getOneBooking', Admin.getOneBooking)
router.post('/cancelBooking', Admin.cancelBooking)

//user routes
router.post('/getUserData', Auth.getUserData)
router.post('/bookCab', Auth.bookCab)
router.post('/cancelBooking', Auth.cancelBooking)
router.post('/history', Auth.getBookingHistoryByUser)



module.exports = router;
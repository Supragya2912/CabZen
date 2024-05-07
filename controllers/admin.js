const User = require('../model/User');
const bcrypt = require('bcrypt');
const Brand = require('../model/Brands');
const Cab = require('../model/Cab');
const Booking = require('../model/Booking');
const { resetPassword } = require('./auth');

exports.getAllUsers = async (req, res, next) => {

    try {

        const { page, limit = 10 } = req.body;
        const offset = (page - 1) * limit;

        const users = await User.find({ role: "user" }).skip(offset).limit(limit);

        users.forEach(user => {
            user.password = undefined;
        }
        )

        res.status(200).json({
            status: 'success',
            message: 'User list fetched successfully',
            data: users
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.addUser = async (req, res, next) => {

    try {

        const { fullName, email, password, userName, phone, role } = req.body;
        const existingUser = await User.findOne({ userName });
      

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }


        if (role === "admin") {
            return res.status(401).json({
                status: 'error',
                message: 'You are not authorized to add admin'
            })
        }


        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            fullName,
            email,
            password: securedPassword,
            userName,
            phone,
            role
        })

        res.status(200).json({
            success: true,
            message: 'User created successfully',
            data: user
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.updateUser = async (req, res, next) => {

    try {

        const { fullName, email, userName, phone, role } = req.body;
     

        if (!userName) {
            return res.status(400).json({
                status: 'error',
                message: 'Username is required'
            })
        }


        const existing_user = await User.findOne({ userName });

        if (!existing_user) {
            return res.status(400).json({
                status: 'error',
                message: 'User does not exist'
            })
        }

        if (fullName) existing_user.fullName = fullName;
        if (email) existing_user.email = email;
        if (phone) existing_user.phone = phone;
        if (role) existing_user.role = role;

        const updatedUser = await existing_user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.deleteUser = async (req, res, next) => {

    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Username is required'
            })
        }

        const existing_user = await User.findById(id);

        if (!existing_user) {
            return res.status(400).json({
                status: 'error',
                message: 'User does not exist'
            })
        }

        await User.deleteOne({ _id: existing_user._id });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.addBrand = async (req, res, next) => {

    try {

        const { name, description } = req.body;
 
        if (!name || !description) {
            return res.status(400).json({
                status: 'error',
                message: 'Name and description are required'
            });
        }

        const existingBrand = await Brand.findOne({ name })
    
        if (existingBrand) {
            return res.status(400).json({
                status: 'error',
                message: 'Brand already exists'
            })
        }

        const brand = await Brand.create({
            name,
            description
        })

        res.status(200).json({
            success: true,
            message: 'Brand added successfully',
            data: brand
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.listAllBrands = async (req, res, next) => {

    try {

        const { page, limit = 10 } = req.body
        const offset = (page - 1) * limit;

        const brands = await Brand.find({}).skip(offset).limit(limit);

        res.status(200).json({
            success: true,
            message: 'Brand list fetched successfully',
            data: brands

        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.updateBrand = async (req, res, next) => {

    try {

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'name is required'
            })
        }

        const existingBrand = await Brand.findOne({ name });

        if (!existingBrand) {
            return res.status(400).json({
                status: 'error',
                message: 'Brand does not exist'
            })
        }

        if (description) existingBrand.description = description;

        const updatedBrand = await existingBrand.save();

        res.status(200).json({
            success: true,
            message: 'Brand updated successfully',
            data: updatedBrand
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.deleteUserBrand = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id is required'
            });
        }

        const existingBrand = await Brand.findById(id);

        if (!existingBrand) {
            return res.status(404).json({
                status: 'error',
                message: 'Brand does not exist'
            });
        }

        await Brand.deleteOne({ _id: existingBrand._id });

        return res.status(200).json({
            success: true,
            message: 'Brand deleted successfully',
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

exports.addCab = async (req, res, next) => {

    try {

        const { brand, driver, licensePlate, model, color } = req.body;

        if (!brand || !driver || !licensePlate) {
            return res.status(400).json({
                status: 'error',
                message: 'Brand, driver and license plate are required'
            })
        }

        const existingCab = await Cab.findOne({ licensePlate });

        if (existingCab) {
            return res.status(400).json({
                status: 'error',
                message: 'Cab already exists'
            })
        }

        const cab = await Cab.create({
            brand,
            driver,
            licensePlate,
            model,
            color
        })

        res.status(200).json({
            success: true,
            message: 'Cab added successfully',
            data: cab
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.listAllCabs = async (req, res, next) => {

    try {

        const { page, limit = 10 } = req.body
     
        const offset = (page - 1) * limit;
       

        const cabs = await Cab.find({})
        .populate('brand')
        .populate('driver')
        .skip(offset)
        .limit(limit);

        res.status(200).json({
            success: true,
            message: 'Cab list fetched successfully',
            data: cabs

        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.updateCab = async (req, res, next) => {

    try {

        const { cabId , driver , licensePlate, model, color, status} = req.body;

        if (!cabId) {
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient params'
            })
        }

        const existingCab = await Cab.findOne({ _id: cabId });

        if (!existingCab) {
            return res.status(400).json({
                status: 'error',
                message: 'Cab does not exist'
            })
        }

        if (driver) existingCab.driver = driver;
        if (licensePlate) existingCab.licensePlate = licensePlate;
        if (model) existingCab.model = model;
        if (color) existingCab.color = color;
        if(status) existingCab.status = status;

        const updatedCab = await existingCab.save();

        res.status(200).json({
            success: true,
            message: 'Cab updated successfully',
            data: updatedCab
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.deleteCab = async (req, res, next) => {

    try {
        const { id , userName} = req.body;

        if (!id || !userName) {
            return res.status(400).json({
                status: 'error',
                message: 'Id is required'
            })
        }

        const existingCab = await Cab.findById(id);
        const existingUser = await User.findById(userName);

        if (!existingCab) {
            return res.status(400).json({
                status: 'error',
                message: 'Cab does not exist'
            })
        }

        await Cab.deleteOne({ _id: existingCab._id });

        res.status(200).json({
            success: true,
            message: 'Cab deleted successfully',
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.bookedCabs = async ( req, res, next) => {

    try {
            
            const { page, limit = 10 } = req.body
            const offset = (page - 1) * limit;
    
            const cabs = await Cab.find({ status: 'booked'}).skip(offset).limit(limit);
    
            res.status(200).json({
                success: true,
                message: 'Booked cab list fetched successfully',
                data: cabs
    
            })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

exports.bookedCabByUser = async (req, res, next) => {
    try {
        const { userID } = req.body;

        const latestBooking = await Booking.findOne({ userID: userID })
            .sort({ bookingDateTime: -1 })
            .populate('cabID') 
            .limit(1); 
        


        if (!latestBooking) {
            return res.status(404).json({
                status: 'error',
                message: 'User has not booked any cab',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Latest booked cab',
            data: latestBooking,
        });
    } catch (err) {
       
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};

exports.getAllDrivers = async (req, res, next) => {

    try {

        const { page, limit = 10 } = req.body;
        const offset = (page - 1) * limit;

        const drivers = await User.find({ role: "driver" }).skip(offset).limit(limit);

        drivers.forEach(driver => {
            driver.password = undefined;
        }
        )

        res.status(200).json({
            status: 'success',
            message: 'Driver list fetched successfully',
            data: drivers
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}
const User = require('../model/User');
const bcrypt = require('bcrypt');
const Brand = require('../model/Brands');

exports.getAllUsers = async (req, res, next) => {

    try {

        const { page, limit = 10 } = req.body;
        const offset = (page - 1) * limit;

        const users = await User.find({ role: "user" }).skip(offset).limit(limit);


        res.status(200).json({
            success: 'success',
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
        console.log(existingUser);

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
        console.log(fullName, email, userName, phone, role)

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
            })
        }

        const existingBrand = await Brand.findOne({ brandName })

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

        const {  name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'Name is required'
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

        const { userName, id } = req.body;

        if (!userName || !user_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Id is required'
            })
        }

        const existingBrand = await Brand.findById(id);
        const existingUser = await User.findById(userName);

        if (!existingBrand) {
            res.status(404).json({
                status: 'error',
                message: 'Brand does not exist'
            })
        }

        if(!existingUser){
            res.status(404).json({
                status: 'error',
                message: 'User does not exist'
            })
        }

        await Brand.deleteOne({ _id: existingBrand._id });
    } catch(err){
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}
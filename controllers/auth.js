const jwt = require('jsonwebtoken')
const User = require('../model/User');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res, next) => {

    try {

        const { fullName, email, password, userName, phone, role } = req.body;

        const existingUser = User.findOne({ userName })

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullName,
            email,
            password: securePassword,
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
            message: "Something went wrong !!"
        })
    }
}
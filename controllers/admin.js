const User = require('../model/User');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res, next) => {

    try {
        const { page , limit = 10 } = req.body;
        console.log(page, limit);
        const offset = (page - 1) * limit;
        console.log(offset);

        const users = await User.find({ role: "user" }).skip(offset).limit(limit);
        console.log(users);


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
       
        
        if(role === "admin"){
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

    try{

        const { fullName, email, userName, phone, role } = req.body;
        console.log(fullName, email, userName, phone, role)

        if(!userName){
            return res.status(400).json({
                status: 'error',
                message: 'Username is required'
            })
        }

        
        const existing_user = await User.findOne({userName});
     
        if(!existing_user){
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

    }catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}
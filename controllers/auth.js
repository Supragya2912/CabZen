const jwt = require('jsonwebtoken')
const User = require('../model/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.registerUser = async (req, res, next) => {

    try {

        const { fullName, email, password, userName, phone, role } = req.body;
        const existingUser = await User.findOne({ userName })
    
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Invalid phone number' });
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

const generateRefreshToken = async (req, res, next) => {
    return crypto.randomBytes(10).toString('hex');
}

exports.loginUser = async (req, res, next) => {

    try {

        const { email, password } = req.body;
        const existing_user = await User.findOne({ email })
       

        if (!existing_user) {
            return res.status(400).json({
                status: "error",
                message: 'User does not exist'
            })
        }
      
        const passwordCompare = await bcrypt.compare(password, existing_user.password);
 
        if (!passwordCompare) {
            return res.status(400).json({
                status: "error",
                message: 'Invalid credentials'
            })
        }
      
        const accessToken = jwt.sign(
            { id: existing_user._id },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )
       
        const refreshToken = generateRefreshToken();  
        existing_user.refreshToken = refreshToken;
        const saved_token_response = await existing_user.save();
        console.log(saved_token_response);

        res.cookie('accessToken',accessToken, {httpOnly: true})
        res.cookie('refreshToken',refreshToken, {httpOnly: true})

        res.status(200).json({
            status:'success',
            message:'User logged in successfully',
            accessToken: accessToken
        })

    }catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong !!"
        })
    }
}

exports.protect = async (req, res, next) => {

    try{

        const accessToken = req.cookies.accessToken;

        if(!accessToken){
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized- Token missing'
            })
        }

        const decoded = jwt.verify(accessToken,process.env.SECRET_KEY)
        req.user = decoded;
        next();

    }catch (err){

        if(err instanceof jwt.TokenExpiredError){
           
            const refreshToken = req.cookies.refereshToken;
            if (!refreshToken) {
                return res.redirect('/login');
            }

            const user = await User.findOne({ refreshToken });

            if (!user) {
                return res.redirect('/login');
            }

            const newAccessToken = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
            res.cookie('accessToken', newAccessToken, { httpOnly: true });

            req.user = user;
            next();

        }
        res.status(500).json({
            status: 'error',
            message: "Something went wrong !!"
        })
    }
}
const jwt = require('jsonwebtoken')
const User = require('../model/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { stat } = require('fs');

exports.registerUser = async (req, res, next) => {

    try {

        const { fullName, email, password, userName, phone, role } = req.body;
       

        if (!userName || !email || !password || !role || !phone || !fullName) {
            return res.status(400).json({ message: 'All fields are required' });
        }


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
        await existing_user.save();

        existing_user.password = undefined;

        res.cookie('accessToken', accessToken, { httpOnly: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true })

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            // data: existing_user,
            accessToken: accessToken
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong !!"
        })
    }
}

exports.protect = async (req, res, next) => {

    if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
        return res.send(error(401, 'Authorization header is required'));
    }
    
    const accessToken = req.headers.authorization.split(' ')[1];

    try {

        const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (!accessToken) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - Token missing'
            });
        }
        
        req.user = user;

        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            const refreshToken = req.cookies.refreshToken;

            try {
                const user = await User.findOne({ refreshToken });

                if (!user) {
                    throw new Error('User not found');
                }

                const newAccessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                res.cookie('accessToken', newAccessToken, { httpOnly: true });

                req.user = user;
                next();
            } catch (error) {
                console.error('Error refreshing access token:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Failed to refresh access token'
                });
            }
        } else {
            console.error('Error verifying access token:', err);
            res.status(500).json({
                status: 'error',
                message: 'Failed to verify access token'
            });
        }
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email });


        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetPasswordOtp = otp;

        console.log("USER OTP", user.resetPasswordOtp);
        user.resetPasswordExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        console.log("USER SAVED", user);


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SENDER_MAIL,
                pass: process.env.SENDER_PASS
            }
        });

        const mailOptions = {
            from: 'SUPRAGYA ANAND',
            to: user.email,
            subject: 'Reset Password OTP',
            text: `Your OTP to reset the password is: ${otp}\n\n`
                + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to send OTP email'
                });
            }
            console.log('Email sent: ' + info.response);
            res.status(200).json({
                status: 'success',
                message: 'OTP email sent'
            });
        });
    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email ,newPassword, confirmPassword , otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Passwords do not match'
            });
        }

        if (user.resetPasswordOtp !== otp) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid OTP'
            });
        }

        if (user.resetPasswordExpiresAt < new Date()) {
            return res.status(400).json({
                status: 'error',
                message: 'OTP expired'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);


        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully'
        });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

exports.getUser = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'User not found'
            });
        }

        user.password = undefined;
        user.confirmPassword = undefined;
        user.resetPasswordExpiresAt = undefined;
        user.resetPasswordOtp = undefined;

        res.status(200).json({
            status: 'success',
            data: user
        });

    } catch (err) {
        console.error('Error getting user:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user = await User.findById(user_id);
        const { name, email, phone, location } = req.body;

        
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (phone && phone.length !== 10) {
            return res.status(400).json({ message: 'Phone number should be 10 digits' });
        }

        if (name) {
            user.fullName = name;
        }
        if (email) {
            user.email = email;
        }
        if (phone) {
            user.phone = phone;
        }
        if (location) {
            const { address, city, state, pincode } = location;

            if (!city || !state || !pincode || !address) {
                return res.status(400).json({ message: 'All fields in the location object are required' });
            }

            user.location = location;
        }

        await user.save();

        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updatePassword = async (req, res) => {

    try {
        const user_id = req.user.id;
        const user = await User.findById(user_id);

        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const passwordCompare = await bcrypt.compare(oldPassword, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ status: 'success', message: 'Password updated successfully'});
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

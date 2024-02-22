const mongoose = require('mongoose');


const userSchema = mongoose.Schema({

    fullName: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'driver'],
        required: true,
    }
})

module.exports = mongoose.model('User', userSchema);
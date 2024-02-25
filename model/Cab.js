const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    driver:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    licensePlate:{
        type: String,
        required: true,
        unique: true
    },
    model: String,
    color: String,
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'active','inactive'],
        default: 'inactive'
    }
})

module.exports = mongoose.model('Cab', cabSchema);
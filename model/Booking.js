const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({

    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cabID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Cab',
        required: true
    },
    bookingDateTime:{
        type: Date,
        required: true
    },
    pickupLocation:{
        type: String,
        required: true,
    },
    destination:{
        type: String,
        required: true,
    },
    fare:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Booking', bookingSchema);
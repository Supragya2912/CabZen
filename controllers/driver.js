const Booking = require('../model/Booking');
const User = require('../model/User');

exports.getAllBooking = async (req, res, next) => {

    try {
        const bookings = await Booking.find();
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getOneBooking = async (req, res, next) => {

    const { bookingId } = req.body;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(400).json({ message: 'Booking not found' })
        }
        return res.status(200).json(booking);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.cancelBooking = async (req, res, next) => {
    const { bookingId, userId } = req.body;

    try {
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(400).json({ message: 'Booking not found' })
        }

        if(booking.userID.toString() !== userId.toString()){
            return res.status(400).json({ message: 'Booking not found' })
        }
        if (booking.driver.toString() !== userId) {
            return res.status(400).json({ message: 'Unauthorized to cancel this booking' });
        }

        await Booking.findByIdAndDelete(bookingId);

        return res.status(200).json({ message: 'Booking cancelled successfully' });

    } catch (error) {

        return res.status(500).json({ message: error.message })
    }
}


//get ratings from user
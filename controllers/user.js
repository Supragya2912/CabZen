const User = require('../model/User');
const Booking = require('../model/Booking');
const Cab = require('../model/Cab');


exports.getUserData = async (req, res, next) => {

    const { id } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.bookCab = async (req, res, next) => {

    const { userID, cabID,  pickupLocation, destination, fare } = req.body;
   

    try {

        const user = await User.findById(userID);
        
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }


        const cab = await Cab.findById({_id:cabID});

       

        if (!cab || cab.status === 'booked'  || cab.status === 'inactive') {
            return res.status(400).json({ message: 'Cab not found' })
        }
    

        if(pickupLocation === "" || destination === "" || fare === ""){
            return res.status(400).json({ message: 'Pickup Location, Destination and Fare are required' })
        }
    

        const bookingDateTime = new Date(); 

        const booking = new Booking({
            userID,
            cabID,
            bookingDateTime,
            pickupLocation,
            destination,
            fare
        })
    
        cab.status="booked";
        await cab.save();

    
        await booking.save();
    
        return res.status(200).json({
            message: 'Cab booked successfully',
            data: booking
        });
        
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.cancelBooking = async (req, res, next) => {
    const { bookingId, userId } = req.body;

    try {

        const booking = await Booking.findById(bookingId);

   
        if (!booking) {
            return res.status(400).json({ message: 'Booking not found' });
        }

      
        if (booking.userID.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
        }
        await booking.remove();

        return res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
   
        return res.status(500).json({ message: error.message });
    }
};

exports.getBookingHistoryByUser = async (req, res) => {
    try {

        const { userId } = req.body;

        const bookingHistory = await Booking.find({ userID: userId }).populate('cabID');

        if (bookingHistory.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'User has no booking history',
            });
        }


        res.status(200).json({
            success: true,
            message: 'Booking history fetched successfully',
            data: bookingHistory,
        });
    } catch (err) {
        console.error('Error fetching booking history:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};

//raise an issue to admin


//add ratings for driver
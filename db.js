const mongoose = require('mongoose');
// Connection URL
const url = 'mongodb://localhost:27017/cabZen';

// Connect to the MongoDB server
const connectMongo = () => {
    mongoose.connect(url);

    // Connection events
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
};

module.exports = connectMongo;
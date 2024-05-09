const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({

    email : {
        type: String,
        required: true,
        unique: true
    },
    issue: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    }

})

module.exports = mongoose.model('Issue', issueSchema);

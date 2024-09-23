const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    user_image: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
    }
});

module.exports = mongoose.model('User', userSchema);

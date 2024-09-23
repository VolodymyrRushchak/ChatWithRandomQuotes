const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    isMine: {
        type: Boolean,
        required: true
    }
});
  
const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    messages: [messageSchema]
});
  
  
module.exports = mongoose.model('Chat', chatSchema);
const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const User = require('../models/User');


const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB'); 

  try {
    await Chat.deleteMany({});
    await User.deleteMany({});
    console.log('Chats and users collections cleared.');

  } catch (err) {
    console.error('Error initializing data:', err.message);
  }
});

module.exports = db;
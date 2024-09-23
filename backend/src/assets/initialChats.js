const Chat = require('../models/Chat');


const alice = new Chat({
  firstName: "Alice",
  lastName: "Freeman",
  messages: [
    { text: "Hello! How are you?", isMine: false },
  ]
});
  
const josefina = new Chat({
  firstName: "Josefina",
  lastName: "",
  messages: [
    { text: "Hi! No, I am going for a walk.", isMine: false },
  ]
});
  
const velazquez = new Chat({
  firstName: "Velazquez",
  lastName: "",
  messages: [
    { text: "I am a little sad, tell me a joke please.", isMine: false },
  ]
});


const initialChats = [alice, josefina, velazquez];
module.exports = initialChats;
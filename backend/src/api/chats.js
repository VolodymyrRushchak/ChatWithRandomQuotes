const express = require("express");
const { isUserAuthenticated } = require("../middlewares/auth");
const Chat = require("../models/Chat");

const router = express.Router();

router.get('/chats', isUserAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const chats = await Chat.find({ userId });
  res.json(chats);
}); 

router.post('/chats', isUserAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const newChat = new Chat(req.body); 
  newChat.userId = userId;
  await newChat.save();
  res.status(201).json(newChat);
}); 

router.put('/chats/:id', isUserAuthenticated, async (req, res) => {
  const { id } = req.params; 
  try {
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.firstName = req.body.firstName;
    chat.lastName = req.body.lastName;
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/chats/:id', isUserAuthenticated, async (req, res) => {
  const chatId = req.params.id;

  try {
    const deletedChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
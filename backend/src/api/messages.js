const express = require('express');
const { isUserAuthenticated } = require('../middlewares/auth');
const Chat = require('../models/Chat');
const { userIdToSocket, autoMessaging } = require('../utils/websockets');
const getRandomMessage = require('../utils/quotable');
const WebSocket = require('ws');


const router = express.Router();


router.put('/chats/:id/messages/:m_id', isUserAuthenticated, async (req, res) => {
  const { id, m_id } = req.params;
  const { text } = req.body;

  try {
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = chat.messages.id(m_id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (!message.isMine) {
      return res.status(403).json({ message: 'You can only edit your own messages' });
    }

    message.text = text;
    await chat.save(); 
    res.json(message);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/chats/:id/messages', isUserAuthenticated, async (req, res) => {
  const { id } = req.params;
  const newMessage = { text: req.body.text, isMine: true, timestamp: new Date().toISOString() };

  try {
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' }); 
    }

    chat.messages.push(newMessage);
    await chat.save();

    res.json(chat.messages[chat.messages.length - 1]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }

  const userId = req.user._id.toString();
  if (!userIdToSocket.has(userId)) {
    console.log(`WS: User with id=${userId} not found`);
    return;
  }
  setTimeout(async () => {
    try {
      const newMessage = await getRandomMessage();
      const chat = await Chat.findById(id); 
      if (!chat) {
        console.log(`Chat with id=${id} not found`);
        return;
      }
      chat.messages.push(newMessage);
      await chat.save();
      if (!userIdToSocket.has(userId)) {
        console.log(`WS: User with id=${userId} not found before sending a message`);
        return;
      }
      const clientSocket = userIdToSocket.get(userId);
      if (clientSocket && clientSocket.readyState === WebSocket.OPEN) { 
        clientSocket.send(JSON.stringify({ type: 'message', chatId: id, payload: chat.messages[chat.messages.length - 1] }));
      } else {
        console.log(`Something's wrong with Client with id=${userId}`); 
        return; 
      }
  
    } catch (err) {
      console.log(err);
    }
  }, 3000);
  
});

router.post('/toggle-auto-messaging/:on', isUserAuthenticated, async (req, res) => {
  const userId = req.user._id.toString();
  const { on } = req.params;
  if (!userIdToSocket.has(userId)) {
    return res.status(404).json({ message: `Client with id=${userId} not found` });
  }
  if (autoMessaging.get(userId) && on === 'on') {
    return res.status(400).json({ message: 'Auto messaging is already enabled' });
  }
  autoMessaging.set(userId, on === 'on');
  if (on !== 'on') {
    res.status(200).json({ message: 'Auto messaging disabled' });
    return;
  }
  const timer = setInterval(async () => {
    try {
      const newMessage = await getRandomMessage();
      const chats = await Chat.find({ userId: userId });
      if (!chats.length) {
        console.log(`No chats available for user with id=${userId}`);
        return;
      }
      const randomChat = chats[Math.floor(Math.random() * chats.length)];
      const chatId = randomChat._id;
      randomChat.messages.push(newMessage);
      await randomChat.save();
      if (!userIdToSocket.has(userId) || !autoMessaging.get(userId)) {
        console.log(`Disabling auto messaging for user with id=${userId}`);
        autoMessaging.delete(userId);
        clearInterval(timer);
        return;
      }
      const clientSocket = userIdToSocket.get(userId); 
      if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(JSON.stringify({ type: 'message', chatId: chatId, payload: randomChat.messages[randomChat.messages.length - 1] }));
      } else {
        console.log(`Something's wrong with Client with id=${clientId}`);
        return;
      }
  
    } catch (err) {
      console.log(err);
    }
  }, 5000);
  res.status(200).json({ message: 'Auto messaging enabled' });

});

module.exports = router;
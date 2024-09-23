const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const User = require('./models/User');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'; // needed for the quotable API to work


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


const db = require('./database');
const { userIdToSocket, socketToUserId } = require('./utils/websockets');
const api = require("./api");
require("./auth/passportGoogleSSO");

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_SECRET],
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(api);


wss.on('connection', (ws) => {

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    if (data.type === 'auth') {
      const userId = data.payload.userId;
      if (userIdToSocket.has(userId)) {
        ws.send(JSON.stringify({ type: 'status', payload: 'failed' }));
        return;
      }
      const user = await User.findById(userId);
      if (!user) {
        ws.send(JSON.stringify({ type: 'status', payload: 'failed' }));
        return;
      }
      userIdToSocket.set(userId, ws);
      socketToUserId.set(ws, userId);
      console.log(`WS: User with id=${userId} authenticated`);
      ws.send(JSON.stringify({ type: 'status', payload: 'success' }));
    }
  });

  ws.on('close', () => {
    const userId = socketToUserId.get(ws);
    if (userId) {
      userIdToSocket.delete(userId);
      console.log(`WS: User with id=${userId} disconnected`);
    }
    socketToUserId.delete(ws);
  });

});
 

module.exports = server;

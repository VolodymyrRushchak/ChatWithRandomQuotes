const express = require("express");
const authWithGoogleApi = require("./authWithGoogle");
const userApi = require("./user");
const chatsApi = require("./chats");
const messagesApi = require("./messages");

const router = express.Router();

router.use(authWithGoogleApi);
router.use(userApi);
router.use(chatsApi);
router.use(messagesApi);

module.exports = router;
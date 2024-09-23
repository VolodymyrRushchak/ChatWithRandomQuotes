const express = require("express");
const passport = require("passport");
const { isUserAuthenticated } = require("../middlewares/auth");
const { userIdToSocket, socketToUserId } = require("../utils/websockets");
const asyncHandler = require('express-async-handler');

const router = express.Router();


router.get("/auth/google", passport.authenticate("google", ["profile", "email"]));

router.get("/auth/google/callback",
  passport.authenticate("google", { 
    successRedirect: `${process.env.FRONTEND_URL}/login/success`,
    failureRedirect: `${process.env.FRONTEND_URL}/login/failed` 
  })
); 

router.get("/auth/logout", isUserAuthenticated, asyncHandler(async (req, res, next) => {
  console.log('Logging out: ', req.user.email);
  const userId = req.user._id.toString();
  socketToUserId.delete(userIdToSocket.get(userId));
  userIdToSocket.delete(userId);
  console.log('WS: User with id=', userId, ' logged out');
  req.logout((err)=>{ 
    console.log("Logged out");
    if (err) return next(err);
  }) 
  console.log('Logged out');
  res.status(200).json({ message: 'Logged out successfully' });
}))

module.exports = router;
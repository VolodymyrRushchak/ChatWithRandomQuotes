const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User');
const Chat = require('../models/Chat');
const initialChats = require('../assets/initialChats');


passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  passReqToCallback: true,
  scope: ["profile", "email"]
}, 
async function (request, accessToken, refreshToken, profile, done){
  try{
    // get the returned data from profile
    let data = profile?._json;
    let user = await User.findOne({email: data.email});

    if(!user){ // create user, if user does not exist
      const newUser = await User.create({
        firstname: data.given_name,
        lastname: data.family_name, 
        user_image: data.picture,
        email: data.email,
        googleId: profile.id
      });
  
      const newChats = initialChats.map(chat => {
        let newChat = {
          userId: newUser._id, 
          firstName: chat.firstName, 
          lastName: chat.lastName, 
          messages: [...chat.messages]
        };
        return Chat(newChat);
      });
      await Chat.insertMany(newChats);
      console.log('Initialized chats for new user: ', newUser.email);

      return await done(null, newUser)
    }
    return await done(null, user)

  } catch(error){
    return done(error, false)
  }

}));


passport.serializeUser((user, done) => { 
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).catch(err => {
    console.log("Error deserializing: ", err);
    done(err, null);
  });
  if (!user) {
    console.log("User not found while deserializing");
    done(null, null);
  }
  done(null, user);
});


const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User'); // We'll create this later

//console.debug('GitHub Client ID:', process.env.GITHUB_CLIENT_ID);
//console.debug('GitHub Client Secret:', process.env.GITHUB_CLIENT_SECRET ? 'Present' : 'Missing');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          avatar: profile.photos[0].value
        });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

module.exports = passport; 
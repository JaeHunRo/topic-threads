var configAuth = require('./auth');
var FacebookStrategy = require('passport-facebook').Strategy;
var userController = require('../app/controllers/userController');

// configure passport object
module.exports = function(passport) {
    // Configure Passport authenticated session persistence.
    //
    // In order to restore authentication state across HTTP requests, Passport needs
    // to serialize users into and deserialize users out of the session.  In a
    // production-quality application, this would typically be as simple as
    // supplying the user ID when serializing, and querying the user record by ID
    // from the database when deserializing.  However, due to the fact that this
    // example does not have a database, the complete Twitter profile is serialized
    // and deserialized.
    passport.serializeUser(function(user, cb) {
      cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
      cb(null, obj);
    });

    passport.use(new FacebookStrategy({
        clientID: configAuth.FACEBOOK_APP_ID,
        clientSecret: configAuth.FACEBOOK_APP_SECRET,
        callbackURL: configAuth.FACEBOOK_CALLBACK
      },
      function(accessToken, refreshToken, profile, cb) {
        
        // search in user table for facebook id
        userController.registerUser(profile, cb);
      }
    ));

};
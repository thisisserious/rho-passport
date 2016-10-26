const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // only want the strategy section of passport-local
// ^^^ storing the pw & user in a local database
const User = require('../models/user');

exports.setup = function() {
  // passport configuration

  // look up two fields, call function, but w/out parentheses; when you get the request, THEN run function
  // when someone asks for the 'local' strategy, use the following info from the request
  // and the findAndComparePassword function to validate
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, findAndComparePassword));

  // converts a user to a user id
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // converts a user id to a user; null is the error
  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });
};

function findAndComparePassword(username, password, done) {
  // look up the user by their username
  User.findOne({username: username}).then(function(user) {
    if(!user) {
      // did not find a user, not a successful login
      return done(null, false);
    }
    // compare the password
    user.comparePassword(password).then(function(isMatch) {
      if (isMatch) {
        done(null, user);
      } else {
        done(null, false);
      }
    });

  }).catch(function(err) { // catch any errors if/when they occur; helps for debugging
    console.log('Error finding user', err);
    done(err);
  });

  // indicate whether or not it matched
}

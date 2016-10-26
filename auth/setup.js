const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

exports.setup = function () {
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, findAndComparePassword));

  // converts user to user id
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  // converts user id to user
  passport.deserializeUser(function(id, done){
    User.findById(id).then(function(user){
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  });
};

function findAndComparePassword(username, password, done) {
  User.findOne({ username: username }).then(function(user){
    if (!user) {
      // didn't find a user with the same username
      console.log('failed to find user with username:', username);
      return done(null, false);
    }

    console.log('found user:', user);
    // at this point we have found a user
    // still need to check their password
    user.comparePassword(password)
        .then(function(isMatch){
          if (isMatch) {
            // successfully auth the user
            return done(null, user);
          } else {
            done(null, false);
          }
        });
  }).catch(function(err){
    console.log('Error finding user', err);
    done(null, false);
  });
}

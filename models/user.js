const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
// make sure that every time we save a user, the password gets hashed
userSchema.pre('save', function(done) {
    const user = this;
    bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {
      if (err) {
        console.log('Error hasing password', err);
        return done(new Error('Error hashing password')); // will prevent it from saving to db, if there's an error
      }

      user.password = hash;
      done();
    });
  });

userSchema.methods.comparePassword = function(password) {
  const user = this;
  return new Promise(function(resolve) {
    bcrypt.compare(password, user.password, function(err, match) {
      if (err) {
        console.log('Error comparing password', err);
        return resolve(false);
      }

      resolve(match);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 11;

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.methods.comparePassword = function(password) {
  const user = this;
  return new Promise(function(resolve){
    bcrypt.compare(password, user.password, function(err, match){
      if (err) {
        console.log('Error comparing password', err);
        return resolve(false);
      }

      resolve(match);
    });
  });
};

userSchema.pre('save', hashPassword);

function hashPassword(next) {
  const user = this;
  bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash){
    if (err) {
      console.log(err);
      return next(new Error('error hashing password'));
    }
    user.password = hash;
    next();
  });
}

const User = mongoose.model('User', userSchema);

module.exports = User;

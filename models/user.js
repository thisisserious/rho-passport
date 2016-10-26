const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.methods.comparePassword = function(password) {
  const user = this;
  return new Promise(function(resolve){
    if (user.password === password) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

const router = require('express').Router();
const User = require('../models/user');

router.post('/', function(req, res) {
  console.log('registering new user');
  const user = new User({username: req.body.username, password: req.body.password});
  user.save().then(function() {
    req.login(user, function(err){
      if (err) {
        return res.sendStatus(500);
      }
      res.sendStatus(201);
    });

  }).catch(function(err){
    console.log('Error in /register', err);
    res.sendStatus(500);
  });
});

module.exports = router;

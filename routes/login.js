const router = require('express').Router();
const passport = require('passport');

router.post('/', passport.authenticate('local'), function(req, res) {
  // this is where we need to check the password
  res.sendStatus(200);
});

module.exports = router;

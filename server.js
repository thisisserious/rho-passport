const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db/connection');
const path = require('path');
const login = require('./routes/login');
const register = require('./routes/register');

const passport = require('passport');
const session = require('express-session');
const auth = require('./auth/setup');

auth.setup();
connection.connect();

const app = express();

const sessionConfig = {
  secret: 'super secret string goes here', // TODO in a real app this would be read from ENV
  key: 'user',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000, secure: false }
};

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// anyone can access these routes
app.use('/login', login);
app.use('/register', register);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

// everything after this must be authenticated
app.use(ensureAuthenticated);

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

var server = app.listen(3000, function() {
  console.log('Listening on port', server.address().port);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
}

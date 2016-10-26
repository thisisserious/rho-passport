const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db/connection'); // a library to connect to mongo
const path = require('path');
const login = require('./routes/login'); // router that hold express routes for login
const register = require('./routes/register'); // router that hold express routes for registering
const auth = require('./auth/setup');
const passport = require('passport'); // require passport, remember to initialize below
const session = require('express-session');

const sessionConfig = {
  secret: 'super secret key goes here', // TODO this should be read from ENV
  key: 'user',
  resave: true,
  saveUnintialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000,
    secure: false
  }
};

connection.connect(); // connect to db
auth.setup();

const app = express();

app.use(session(sessionConfig)); // tell Express it should be keeping track of sessions
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', login);
app.use('/register', register);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

// everything beyond this point must be authenticated
app.use(ensureAuthenticated);

// below ensureAuthenticated to make sure user is authorized to be at this /supersecret route
app.get('/supersecret', function(req, res) {
  res.send('the password is banana');
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
}
var server = app.listen(3000, function() {
  console.log('Listening on port', server.address().port); // server.address() prints out the port the server is listening on
});

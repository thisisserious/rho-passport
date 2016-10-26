const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db/connection');
const path = require('path');
const login = require('./routes/login');
const register = require('./routes/register');

connection.connect();

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/login', login);
app.use('/register', register);

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

var server = app.listen(3000, function() {
  console.log('Listening on port', server.address().port);
});

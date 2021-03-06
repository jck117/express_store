//17.9 POST & DELETE requests
//app.js to export the app ready for integration testing

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const uuid = require('uuid/v4') //17.9, p. 12
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(express.json()) //17.9
app.use(helmet())

//17.9
const users = [
  {
    "id": "3c8da4d5-1597-46e7-baa1-e402aed70d80",
    "username": "sallyStudent",
    "password": "c00d1ng1sc00l",
    "favoriteClub": "Cache Valley Stone Society",
    "newsLetter": "true"
  },
  {
    "id": "ce20079c-2326-4f17-8ac4-f617bfd28b7f",
    "username": "johnBlocton",
    "password": "veryg00dpassw0rd",
    "favoriteClub": "Salt City Curling Club",
    "newsLetter": "false"
  }
]


//17.9
app.post('/', (req, res) => {
    console.log(req.body)
    res.send('POST request received.')
})

//17.9, p.8
app.post('/user', (req, res) => {
  // get the data
  const { username, password, favoriteClub, newsLetter=false } = req.body;

  // validation code here
  if (!username) {
    return res
      .status(400)
      .send('Username required');
  }

  if (!password) {
    return res
      .status(400)
      .send('Password required');
  }

  if (!favoriteClub) {
    return res
      .status(400)
      .send('favorite Club required');
  }

  if (username.length < 6 || username.length > 20) {
    return res
      .status(400)
      .send('Username must be between 6 and 20 characters');
  }
  
  // password length
  if (password.length < 8 || password.length > 36) {
    return res
      .status(400)
      .send('Password must be between 8 and 36 characters');
  }
  
  // password contains digit, using a regex here
  if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
    return res
      .status(400)
      .send('Password must be contain at least one digit');
  }

  const clubs = [
    'Cache Valley Stone Society',
    'Ogden Curling Club',
    'Park City Curling Club',
    'Salt City Curling Club',
    'Utah Olympic Oval Curling Club'
  ];
  
  // make sure the club is valid
  if (!clubs.includes(favoriteClub)) {
    return res
      .status(400)
      .send('Not a valid club');
  }
  
  // generate a unique id
  const id = uuid();

  const newUser = {
    id,
    username,
    password,
    favoriteClub,
    newsLetter
  };

  users.push(newUser);

  //at this point all validation passed
  res.send('All validation passed!');
});

//17.9, p.15,17
app.delete('/user/:userId', (req, res) => {
  const { userId } = req.params;

  const index = users.findIndex(u => u.id === userId);

  // make sure we actually find a user with that id
  if (index === -1) {
    return res
      .status(404)
      .send('User not found');
  }

  users.splice(index, 1);

  res.status(204).end();
});

app.get('/user', (req, res) => {
  res.json(users);
})

app.get('/', (req, res) => {
    res.send('A GET request.')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

app.use(cors())

module.exports = app


/* Notes:

express.json() 
- is middleware.
- parses the body of an HTTP request & gives us a properly 
  formatted object to work with. (17.9, p.4)
- only parses the body if the Content-Type is set to
  application/json (17.9, p.6)

The endpoint '/user' will accept user details in this format (17.9, p.7):
{
  "username": "String between 6 and 20 characters",
  "password": "String between 8 and 36 characters, must contain at least one number",
  "favoriteClub": "One of 'Cache Valley Stone Society', 'Ogden Curling Club', 'Park City Curling Club', 'Salt City Curling Club' or 'Utah Olympic Oval Curling Club'",
  "newsLetter": "True - receive newsletters or False - no newsletters"
}

(e.g.)
{
  "username": "Raymond",
  "password": "password1",
  "favoriteClub": "Cache Valley Stone Society",
  "newsLetter": ""
}




*/
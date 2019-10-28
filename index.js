// implement your API here
console.log('its alive')
//get express to run api like data
const express = require('express')
// set up server to depend on express
const server = express()


// define port to run on 
const port = 5000
server.listen(port, () => console.log('\n RUNNING ON 5000 SERVER \n'))

// run server listen upon npm run server
server.use(express.json())

server.get('/', (req, res) => {
    res.send('User DB is Open')
})

// import db to run commands
const db = require('./data/db')

//get to api users
server.get('/api/users', (req, res) => {
    db.find() //woeks like axios in fe
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        console.log('error', err);
        res.status(500).json({ error: 'failed to get users from db' });
      });
})
//post new user
server.post('/api/users', (req, res) => {
    // define data to post
    const newUser = req.body
    console.log('newUser to post', newUser)
    //run promise post 
    db.insert(newUser)
    .then(users => {
        res.status(201).json(users)
        res.status(400).json()
    })
    // may possibly need to edit 400 if body info is not right
    .catch(err => {
        console.log('error', err);
        res.status(500).json({ error: 'failed to add new users to db' });
      });
})
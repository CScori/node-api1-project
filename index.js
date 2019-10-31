// implement your API here
console.log('its alive')
//get express to run api like data
const express = require('express')
// set up server to depend on express
const server = express()


// define port to run on 
const port = process.env.PORT || 5000
server.listen(port, () => console.log(`\n RUNNING ON ${port} SERVER \n`))

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
//get specific user by id
server.get('/api/users/:id', async (req, res) => {
    const { id } = req.params

    try {
        const user = await db.findById(id)
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ message : 'user not found'})
        }
    } catch (err) {
        res.status(500).json({error: 'failed to get users from db'})
    } 
    })


server.post('/api/users', (req, res) => {
    const newUser = req.body
    if (!newUser.name || !newUser.bio) {
        res.status(400).json({ message: 'please add a user name and bio' })
    } else {
        db.insert(newUser)
            .then(user => {
               return  db.findById(user.id)
            }) 
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
            res.status(500)
            .json({ error: 'failed to get users from db'})
            })
    }
    
})


server.delete('/api/users/:id', async (req, res) => {
    const id = req.params.id
    db.remove(id)
    .then(countDeleted => {
        if (countDeleted > 0) {
            res.status(200).json({message: `User with id of ${id} has been removed`, id: id})
        } else {
            res.status(404).json({errorMessage: `User with ${id} could not be found`})
        }
        
    })
    .catch(err => {
        res.status(500)
        .json({ error: 'failed to get users from db'})
        })
})

server.put('/api/users/:id', async (req, res) => {
    const edit = req.body
    const { id } = req.params
    if (!edit.name || !edit.bio) {
        return res.status(400).json({message: `no user with id of ${id}found`})
    }
    try {
        const user = await db.findById(id)
       
        if (!user) {
            res.status(404).json({message: `no user with id of ${id}found`})
        } else {
            await db.update(id, edit)
            const updateUser = await db.findById(id)

            res.status(200).json(updateUser)
        }
    } catch (err) {
        res.status(500)
        .json({ error: 'failed to get users from db'})
    
    }


})
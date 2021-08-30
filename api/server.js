// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

server.post('/api/users', (req, res)=>{
    const newUser = req.body
    User.insert(newUser)
        .then(user=>{
            res.status(201).json(user)
        })
        .catch(err=>{
            res.status(400).json({message:"Please provide name and bio for the user"})
        })
})

server.get('/api/users', (req, res)=>{
    User.find()
        .then(users=>{
            res.status(200).json(users)
        })
        .catch(err=>{
            res.status(500).json({message: "The users information could not be retrieved"})
        })
})

server.get('/api/users/:id', async (req, res)=>{
    User.findById(req.params.id)
        .then(user =>{
            if(user){
                res.status(200).json(user)
            }else{
                res.status(404).json({message: "The user with the specified ID does not exist"})
            }
        })
        .catch(err=>{
            res.status(500).json({message: "The user information could not be retrieved"})
        })
})

server.delete('/api/users/:id', (req, res)=>{
    User.remove(req.params.id)
        .then(user =>{
           if(user){
               res.status(200).json(user)
           } else{
               res.status(404).json({message: "The user with the specified ID does not exist"})
           }
        })
        .catch(err=>{
            res.status(500).json({message: "The user could not be removed"})
        })
})

server.put('/api/users/:id', async (req, res)=>{
    const { id } = req.params
    const changes = req.body
    try{
        const result = await User.update(id, changes)
        res.status(200).json(result)

    }catch (err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
})


module.exports = server; // EXPORT YOUR SERVER instead of {}

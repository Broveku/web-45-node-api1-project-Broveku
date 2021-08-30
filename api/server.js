// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

server.post('/api/users', (req, res)=>{
    const user = req.body
    if(!user.name || !user.bio) {
        res.status(400).json({
            message: 'Please provide name and bio for the user'
        })
    }else{
        User.insert(user)
            .then(createdUser =>{
                res.status(201).json(createdUser)
            })
            .catch(err =>{
                res.status(500).json({
                    message: 'error creating user',
                    err: err.message
                })
            })

    }
})

server.get('/api/users', (req, res)=>{
    User.find()
        .then(users=>{
            res.status(200).json(users)
        })
        .catch(err=>{
            res.status(500).json({
                message: "error getting users",
                err: err.message,
            })
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

server.delete('/api/users/:id', async (req, res)=>{
    try{
        const possibleUser = await User.findById(req.params.id)
        if(!possibleUser){
            res.status(404).json({
                message: "The user with the specified ID does not exist"
            })
        }else{
            const deletedUser = await User.remove(possibleUser.id)
            res.status(200).json(deletedUser)
        }
    }catch (err) {
        res.status(500).json({
            message:'error creating user',
            err: err.message,
            stack:err.stack
        })
    }
})

server.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    console.log(id, changes);
    try {
      if (req.body.name && req.body.bio) {
        const result = await User.update(id, changes);
        if (result) {
          res.status(200).json(result);
        } else {
          res
            .status(404)
            .json({ message: "The user with the specified ID does not exist" });
        }
      }else{
          res.status(400).json({message: "Please provide name and bio for the user" })
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "The user information could not be modified" });
    }
  });


module.exports = server; // EXPORT YOUR SERVER instead of {}

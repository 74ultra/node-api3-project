const express = require('express');
const User = require('./userDb.js');
const Posts = require('../posts/postDb.js')


const router = express.Router();

router.post('/', validateUser, (req, res) => {
  const { name } = req.body;
  console.log(req.body)
  User.insert({name})
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Error inserting user"})
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const { id: user_id } = req.params;
  const { text } = req.body;
  Posts.insert({ user_id, text })
    .then(post => {
      res.status(201).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Error inserting new post"})
    })
});

router.get('/', (req, res) => {
  User.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "Error retrieving users"})
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(goober)
  // const { id } = req.params;
  // User.getById(id)
  //   .then(user => {
  //     res.status(200).json(user)
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     res.status(500).json({ error: "Error retrieving user."})
  //   })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;
  User.getUserPosts(id)
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "There was an error retrieve the user's posts"})
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // const { id } = req.params;
  const { id } = goober;
  User.remove(id)
    .then(() => {
      res.status(200).end()
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: "There was a problem deleting the user"})
    })
});

router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
        User.update(id, { name })
          .then(updated => {
            if(updated){
              User.getById(id)
                .then(user => {
                  res.status(200).json(user)
                })
                .catch(err => {
                  console.log(err)
                  res.status(500).json({ error: "Error getting user"})
                })
            } else {
              res.status(500).json({error: "There was a problem updating that user"})
            }
          })
          .catch(err => {
            console.log(err)
            res.status(500).json({ error: "Error updating user." })
          })
});
    

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id)
    .then(user => {
      if(user){
        goober = user;
        next();
      } else {
        res.status(404).json({ error: `A user with the id of ${id} does not exist`})
      }
    })
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if(!name){
    res.status(400).json({ message: "A name is required for a new user" })
  } else if (typeof name !== 'string') {
    res.status(400).json({ message: "Name must be a string" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if(!req.body){
    return res.status(400).json({ error: "Missing post data"})
  } else if (!text) {
    return res.status(400).json({ error: "Missing required text field"})
  } else {
    next()
  }
}

module.exports = router;

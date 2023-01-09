const express = require('express')
const usersRouter = express.Router();
const usersJSON = require('../json_db/users.json')
const db = require('../db/index.js')

module.exports = usersRouter;

//GET all users
// usersRouter.get('/', (req, res) => {
//     const users = usersJSON
//     res.send(users)
// })

usersRouter.get('/', db.getUsers)

//GET user by id
usersRouter.get("/:id", (req, res) => {
    const { id } = req.params;
  
    const filteredUsers = usersJSON.users.filter((user) => {
      return user.id == id;
    });
  
    if (filteredUsers.length > 0) {
      res.status(200).send(filteredUsers);
    } else {
      res
        .status(404)
        .send(
          "Resource not found. Ensure the url is correct and you are connected to the internet."
        );
    }
  });
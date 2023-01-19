const express = require('express')
const usersRouter = express.Router();
const db_users = require('../db/users.js')

module.exports = usersRouter;

//GET all users - psql database
usersRouter.get('/', db_users.getUsers)

//GET user by id - psql database
usersRouter.get('/:id', db_users.getUserById)

//POST user
usersRouter.post('/', db_users.addUser)


//PUT user
usersRouter.put('/:id', db_users.updateUser)

//DELETE user
usersRouter.delete('/:email', db_users.deleteUserByEmail)
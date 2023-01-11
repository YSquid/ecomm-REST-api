const express = require('express')
const usersRouter = express.Router();
const db_users = require('../db/users.js')

module.exports = usersRouter;

//GET all users - psql database
usersRouter.get('/', db_users.getUsers)

//GET user by id - psql database
usersRouter.get('/:id', db_users.getUserById)

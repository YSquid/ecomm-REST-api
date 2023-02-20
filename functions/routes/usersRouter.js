const express = require('express')
const usersRouter = express.Router();
const db_users = require('../db/users.js')
const db_auth = require('../db/auth')

module.exports = usersRouter;

//GET all users - psql database
usersRouter.get('/', db_auth.isSuperUser, db_users.getUsers)

//GET user by emil - psql database
usersRouter.get('/:id', db_users.getUserById)


//PUT user
usersRouter.put('/:id', db_users.updateUser)

//DELETE user
//Testing - this is tested in app.test.js via the 'deletes registertest user' test
usersRouter.delete('/:id', db_users.deleteUserById)
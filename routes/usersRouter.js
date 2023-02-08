const express = require('express')
const usersRouter = express.Router();
const db_users = require('../db/users.js')

module.exports = usersRouter;

//GET all users - psql database
usersRouter.get('/', db_users.getUsers)

//GET user by emil - psql database
usersRouter.get('/:email', db_users.getUserById)

//POST user
//Deprecated - adding users is handled with register route
// usersRouter.post('/', db_users.addUser)


//PUT user
usersRouter.put('/:email', db_users.updateUser)

//DELETE user
//Testing - this is tested in app.test.js via the 'deletes registertest user' test
usersRouter.delete('/:email', db_users.deleteUserByEmail)
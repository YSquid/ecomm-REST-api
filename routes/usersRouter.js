const express = require('express')
const usersRouter = express.Router();
const usersJSON = require('../json_db/users.json')

module.exports = usersRouter;

usersRouter.get('/', (req, res) => {
    const users = usersJSON
    res.send(users)
})
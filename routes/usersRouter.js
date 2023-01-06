const express = require('express')
const usersRouter = express.Router();

module.exports = usersRouter;

usersRouter.get('/', (req, res) => {
    res.send("Users GET return")
})
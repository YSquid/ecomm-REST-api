const express = require('express');
const authRouter = express.Router();
const passport = require('passport');

authRouter.get("/login", (req, res, next) => {
    res.render('login.ejs')
})

authRouter.post('/login', passport.authenticate('login', {session: true}), (req, res) => {
    res.status(200).send(req.user);
})

authRouter.post('/register', passport.authenticate('register'), (req, res) => {
    res.status(200).send(req.user);
});

authRouter.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.status(200).send('successful logout');
    })
})


module.exports = authRouter

const express = require('express')
const apiRouter = express.Router();
const authRouter = require('./authRouter')
const productsRouter = require('./productsRouter')
const categoriesRouter = require('./categoriesRouter')
const usersRouter = require('./usersRouter')
const ordersRouter = require('./ordersRouter')
const cartsRouter = require('./cartsRouter')
const db_auth = require('../db/auth');



//Mount respective endpoint router at paths
apiRouter.get('/', (req, res) => {
    res.send("Welcome to the API")
})
apiRouter.use('/auth', authRouter)
apiRouter.use('/products/', productsRouter)
apiRouter.use('/categories/', categoriesRouter)
apiRouter.use('/users/', db_auth.checkAuthenticated, usersRouter)
apiRouter.use('/orders/', ordersRouter)
apiRouter.use('/carts/', db_auth.checkAuthenticated, cartsRouter)


module.exports = apiRouter;
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

module.exports = app;

//Middleware for parsing request bodies
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Mount apiRouter (from routes/api) at '/api' path
const apiRouter  = require('./routes/api');
app.use("/api", apiRouter)

//Homepage route
app.get('/', (req, res) => {
    res.send('Hello Express!')
})

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})
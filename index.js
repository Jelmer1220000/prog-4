const express = require('express')
const app = express()
const userRoutes = require('./src/routes/user-routes')
const mealRoutes = require('./src/routes/meal-routes')
const port = process.env.PORT || 3000

//Logging
app.get('*', (req, res, next) => {
    // console.log(`Method ${req.method} is aangeroepen`);
    // console.log(`Op ${req.url}`)
    next()
})

app.use('/api', userRoutes)
//Api meal routes
app.use('/api', mealRoutes)
//added git remote
//Algemene opvang voor base Url
app.get('/', (req, res) => {
    res.status(200).json({
        Message: `Welcome to my API`,
        Message2: `To get Started please enter one of the endpoints below! (with correct body if requested)`,
        Endpoints: [`GET /api/user`, `GET /api/user/{id}`, `GET /api/user/profile`, `POST /api/user`, `PUT /api/user/{id}`, `DELETE /api/user/{id}`],
        Parameters: ['All parameters are for GET /api/user', 'length=(amount of people)', 'active=(true or false)', 'lastName=(lastName of user to search)']
    })
})
//Json Parser
app.use(express.json())
//Api user routes


//Opvang voor fouten
app.all('*', (req, res) => {
    res.status(404).json({
        Message: `Welcome to my API`,
        Message2: `To get Started please enter one of the endpoints below! (with correct body if requested)`,
        Endpoints: [`GET /api/user`, `GET /api/user/{id}`, `GET /api/user/profile`, `POST /api/user`, `PUT /api/user/{id}`, `DELETE /api/user/{id}`],
        Parameters: ['All parameters are for GET /api/user', 'length=(amount of people)', 'active=(true or false)', 'lastName=(lastName of user to search)']
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

module.exports = app

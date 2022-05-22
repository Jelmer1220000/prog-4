const express = require('express')
const app = express()
const userRoutes = require('./src/routes/user-routes')
const mealRoutes = require('./src/routes/meal-routes')
const loginRoutes = require('./src/routes/login-routes')
const port = process.env.PORT || 3000


app.use(express.json())
//Api user routes
app.use('/api/user', userRoutes)
//Api meal routes
app.use('/api/meal', mealRoutes)

app.use('/api/auth', loginRoutes)

app.get('/', (req, res) => {
    res.status(200).json({
        Message: `Welcome to my API`,
        Message2: `To get Started please enter one of the endpoints below! (with correct body if requested)`,
        User_Endpoints: [`GET /api/user`, `GET /api/user/{id}`, `GET /api/user/profile`, `POST /api/user`, `PUT /api/user/{id}`, `DELETE /api/user/{id}`],
        Meal_Endpoints: [`GET /api/meal`, `GET /api/meal/{id}`, `GET /api/meal/{Id}/participate`, `POST /api/meal`, `PUT /api/meal/{id}`, `DELETE /api/meal/{id}`],
        Parameters: ['All parameters are for GET /api/user', 'length=(amount of people)', 'isActive=(true or false)', 'firstName=(lastName of user to search)']
    })
})

app.all('*', (req, res) => {
    res.status(404).json({
        Status: 404,
        Message: `Endpoint not found!`,
        Message2: `Please enter one of the endpoints below!`,
        User_Endpoints: [`GET /api/user`, `GET /api/user/{id}`, `GET /api/user/profile`, `POST /api/user`, `PUT /api/user/{id}`, `DELETE /api/user/{id}`],
        Meal_Endpoints: [`GET /api/meal`, `GET /api/meal/{id}`, `GET /api/meal/{Id}/participate`, `POST /api/meal`, `PUT /api/meal/{id}`, `DELETE /api/meal/{id}`],
        Parameters: ['All parameters are for GET /api/user', 'length=(amount of people)', 'isActive=(true or false)', 'firstName=(lastName of user to search)']
    })
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

module.exports = app

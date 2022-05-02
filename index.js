const express = require('express')
const app = express()
const userRoutes = require('./src/routes/user-routes')
const mealRoutes = require('./src/routes/meal-routes')
const port = process.env.PORT || 3000


//Logging
app.get('*', (req, res, next) => {
  console.log(`Method ${req.method} is aangeroepen`);
  console.log(`Op ${req.url}`)
  next()
})
//testing commit

//Algemene opvang voor base Url
app.get('/', (req, res) => {
    res.status(200).json({
      Message: `Welcome to my API`,
      Message2: `To get Started please enter one of the endpoints below! (with correct body if requested)`,
      Endpoint1: `GET /api/user`,
      Endpoint2: `GET /api/user/{id}`,
      Endpoint3: `GET /api/user/profile`,
      Endpoint4: `POST /api/user`,
      Endpoint5: `PUT /api/user/{id}`,
      Endpoint6: `DELETE /api/user/{id}`
    })
})
//Json Parser
app.use(express.json());
//Api user routes
app.use('/api', userRoutes)
//Api meal routes
app.use('/api', mealRoutes)


//Opvang voor fouten
app.all('*', (req, res) => {
  res.status(404).json({
    Message: `No endpoint found with: ${req.url}`,
    Endpoint1: `GET /api/user`,
    Endpoint2: `GET /api/user/{id}`,
    Endpoint3: `GET /api/user/profile`,
    Endpoint4: `POST /api/user`,
    Endpoint5: `PUT /api/user/{id}`,
    Endpoint6: `DELETE /api/user/{id}`
  })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

module.exports = app;

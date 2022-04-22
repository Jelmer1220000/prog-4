const { Console } = require('console')
const express = require('express')
const path = require('path')
const app = express()
const userRoutes = require('./routes/user-routes')
const port = process.env.PORT || 3000


//Logging
app.get('*', (req, res, next) => {
  console.log(`Method ${req.method} is aangeroepen`);
  console.log(`Op ${req.url}`)
  next()
})

//Algemene opvang voor base Url
app.get('/', (req, res) => {
    res.status(200).json({
      Message: `Welcome to my API`,
      Message2: `To get Started please enter one of the endpoints below! (with correct body if requested)`,
      Endpoint1: `GET /api/users`,
      Endpoint2: `GET /api/user/{id}`,
      Endpoint3: `POST /api/user`,
      Endpoint4: `PUT /api/user/{id}`,
      Endpoint5: `DELETE /api/user/{id}`
    })
})
//Json Parser
app.use(express.json());
//Api user routes
app.use('/api', userRoutes)

//Opvang voor fouten
app.all('*', (req, res) => {
  res.status(404).json({
    Message: `No endpoint found with: ${req.url}`,
    Endpoint1: `GET /api/users`,
    Endpoint2: `GET /api/user/{id}`,
    Endpoint3: `POST /api/user`,
    Endpoint4: `PUT /api/user/{id}`,
    Endpoint5: `DELETE /api/user/{id}`
  })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

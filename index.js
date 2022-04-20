const express = require('express')
const app = express()
const userRoutes = require('./routes/user-routes')
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  var routeArray = ["GET /api/users", "GET /api/user/{id}", "POST /api/user", "PUT /api/user/{id}", "DELETE /api/user/{id}"];
  res.status(200).json({
    Routes: routeArray
  })
})

app.use('/api', userRoutes)



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

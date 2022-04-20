const express = require('express')
const app = express()
const userroutes = require('./routes/user-routes')
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.writeHead(200, { "Content-Type": "text/json" });
  
  var routeArray = ["GET /api/users", "GET /api/user/{id}", "POST /api/user"];
  
  var json = JSON.stringify({
      Routes: routeArray
  })
  res.end(json);
})

app.use('/api', userroutes)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

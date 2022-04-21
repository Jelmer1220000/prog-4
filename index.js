const express = require('express')
const path = require('path')
const app = express()
const userRoutes = require('./routes/user-routes')
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send(`<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
      crossorigin="anonymous"
    />
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
      crossorigin="anonymous"
    ></script>
    <link href="./site/css/style.css" rel="stylesheet" />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      rel="stylesheet"
    />
    <script src="./site/sitejs/script.js"></script>
  </head>

  <body class="backgroundBody">
    <div class="skipToCenter"></div>
    <div class="centerPart">
      <div class="centerBorder">
        <h3>Api Endpoint:</h3>
        <h4 class="animation" id="changeText">Start</h4>
      </div>
      <div class="someSpace"></div>
      <div class = "centerDescription">
        <h3>Endpoint Description:</h3>
        <h4 class="animation" id ="changeDescr">Start</h4>
      </div>
      <div class="someSpace"></div>
      <div class="centerExamples">
        <h3>Endpoint example:</h3>
      <h4 class="animation" id ="changeExample">Start</h4>
    </div>
    </div>
  </body>
</html>`)
    // res.status(200).json({
    //   Message: 'No browser detected, showing endpoints in JSON',
    //   Website: `${req.originalUrl}`,
    //   Endpoint1: `GET /api/users`,
    //   Endpoint2: `GET /api/user/{id}`,
    //   Endpoint3: `POST /api/user`,
    //   Endpoint4: `PUT /api/user/{id}`,
    //   Endpoint5: `DELETE /api/user/{id}`
    // })
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

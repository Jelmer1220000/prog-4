const express = require('express')
const usercontroller = require('../controllers/user-controller')
var bodyParser = require('body-parser')
const router = express.Router()

var jsonParser = bodyParser.json()

// Movie routes

router.get('/users', usercontroller.getAllUsers)
router.get('/user/:userId', usercontroller.getUserById)

router.post('/user', jsonParser,usercontroller.validateUser, usercontroller.createUser)

// router.put('/user/:userId', "Not available yet")
// router.delete('/user/:userId', "Nada")

module.exports = router
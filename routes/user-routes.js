const express = require('express')
const usercontroller = require('../controllers/user-controller')
var bodyParser = require('body-parser')
const userController = require('../controllers/user-controller')
const router = express.Router()

var jsonParser = bodyParser.json()

// Movie routes

router.get('/users', usercontroller.getAllUsers)
router.get('/user/:userId', usercontroller.getUserById)

router.put('/user/:userId', jsonParser, usercontroller.validateUser, usercontroller.changeUser)

router.post('/user', jsonParser, usercontroller.validateUser, usercontroller.createUser)

router.delete('/user/:userId', userController.deleteUser)

module.exports = router
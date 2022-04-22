const express = require('express')
const usercontroller = require('../controllers/user-controller')
// var bodyParser = require('body-parser')
const userController = require('../controllers/user-controller')
const validator = require('../controllers/validator')
const router = express.Router()

// var jsonParser = bodyParser.json()

// User routes

router.get('/users', usercontroller.getAllUsers)
router.get('/user/:userId', usercontroller.getUserById)

router.put('/user/:userId', validator.validateUser, validator.validateEmail, usercontroller.changeUser)

router.get('/user/profile', usercontroller.getProfile)

router.post('/user', validator.validateUser, validator.validateEmail, usercontroller.createUser)

router.delete('/user/:userId', userController.deleteUser)

module.exports = router
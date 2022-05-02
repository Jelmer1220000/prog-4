const express = require('express')
const userController = require('../controllers/user-controller')
const validator = require('../controllers/validator')
const router = express.Router()

// var jsonParser = bodyParser.json()

// User routes

router.get('/user', userController.getAllUsers)
router.get('/user/profile', userController.getProfile)
router.get('/user/:userId', userController.getUserById)

router.put('/user/:userId', validator.validateUser, validator.validateEmail, userController.changeUser)

router.post('/user', validator.validateUser, validator.validateEmail, userController.createUser)

router.delete('/user/:userId', userController.deleteUser)

module.exports = router
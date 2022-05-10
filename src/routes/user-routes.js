const express = require('express')
const userController = require('../controllers/user-controller')
const validator = require('../controllers/validator')
const router = express.Router()

// var jsonParser = bodyParser.json()

// User routes

router.get('', userController.getAllUsers)
router.get('/profile', userController.getProfile)
router.get('/:id', userController.getUserById)

router.put(
    '/:id',
    validator.validateEmail,
    userController.changeUser
)

router.post(
    '',
    validator.validateEmail,
    validator.validateUser,
    userController.createUser
)

router.delete('/:id', userController.deleteUser)

module.exports = router

const express = require('express')
const userController = require('../controllers/user-controller')
const validator = require('../controllers/validator')
const router = express.Router()

// var jsonParser = bodyParser.json()

// User routes

router.get('', userController.getAllUsers)
router.get('/profile', userController.getProfile)
router.get('/:userId', userController.getUserById)

router.put(
    '/:userId',
    validator.validateUser,
    validator.validateEmail,
    userController.changeUser
)

router.post(
    '',
    validator.validateUser,
    validator.validateEmail,
    userController.createUser
)

router.delete('/:userId', userController.deleteUser)

module.exports = router

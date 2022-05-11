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
    validator.validateUserPut,
    userController.changeUser,
    userController.getUserById
)

router.post(
    '',
    validator.validateEmail,
    validator.validateUserPost,
    userController.createUser
)

router.delete('/:id', userController.deleteUser)

module.exports = router

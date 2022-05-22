const express = require('express')
const userController = require('../controllers/user-controller')
const validator = require('../controllers/validator')
const auth = require('../controllers/auth-controller')
const router = express.Router()

// var jsonParser = bodyParser.json()

// User routes

router.get('', userController.getAllUsers)
router.get('/profile', auth.validateToken, userController.getProfile)
router.get('/:id', auth.validateToken, userController.getUserById)

router.put(
    '/:id',
    auth.validateToken,
    validator.validateEmailFormat,
    validator.validateEmail,
    validator.validatePhone,
    validator.validateUserPut,
    validator.validateOwnerUser,
    userController.changeUser,
    userController.getUserById
)

router.post(
    '',
    validator.validatePassword,
    validator.validateEmailFormat,
    validator.validateEmail,
    validator.validateUserPost,
    userController.createUser
)

router.delete('/:id', auth.validateToken, validator.validateOwnerUser, userController.deleteUser)

router.delete('/cleanup', userController.clearDB)

module.exports = router

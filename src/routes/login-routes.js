const auth = require('../controllers/auth-controller')
const express = require('express')
const router = express.Router()
const validator = require('../controllers/validator')

router.post('/login', validator.validatePassword, validator.validateEmailFormat, auth.validateLogin, auth.login)

module.exports = router
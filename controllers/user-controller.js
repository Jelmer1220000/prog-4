const assert = require('assert');
const logger = require('../config/config')
const users = require('../data/users')

let userController = {

getAllUsers(req, res) {
    res.status(200).json({
        message: "Succes",
        userList: users
    })
},

getUserById(req, res, next) {
    logger.info("Get user by Id called")
    logger.info("Searching for user: " + req.params.userId)
   let found = false;
    for (let i = 0; i < users.length; i++) {
        if (req.params.userId == users[i].ID) {
            logger.info("Found")
            found = true;
            res.status(201).json({
                message: "Found user!",
                user: users[i]
            })
        }
    }
    if (found === false) {
        res.status(400).json({
            message: "User: " + req.params.userId + " does not exist!",
        })
    }
},

createUser(req, res) {
    logger.info('Create user called')
    const user = req.body
    user.ID = users.length + 1;
    logger.info(req.body);
    users.push(user)
    res.status(201).json({
        message: "Succesfully created user!",
        user: req.body
    })
},

validateUser(req, res, next) {
    logger.info('validating user')
    try {
      const {firstName, lastName, street, city, isActive, emailAdress, password, phonenumber} = req.body
      assert(typeof firstName === 'string', 'First Name is missing!')
      assert(typeof lastName === 'string', 'Last Name is missing!')
      assert(typeof street === 'string', 'Street is missing!')
      assert(typeof city === 'string', 'City is missing!')
      assert(typeof isActive === 'boolean', 'Is the user active or not? isActive is missing!')
      assert(typeof emailAdress === 'string', 'emailAdress is missing!')
      assert(typeof password === 'string', 'Password is missing!')
      assert(typeof phonenumber === 'string', 'phonenumber is missing!')
      logger.trace('User data is valid!')
      next()
    } catch (err) {
      logger.trace('This info is Invalid: ', err)
      res.status(400).json({
        message: 'Error! Please fill in all required information.',
        error: err.toString()
      })
    }
  },
}

module.exports = userController;
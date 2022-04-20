const assert = require('assert');
const users = require('../data/users')

let userController = {

getAllUsers(req, res) {
    console.log("get all called")
    res.status(200).json({
        message: "Succes",
        userList: users
    })
},

getUserById(req, res, next) {
    console.log("Get user by Id called")
    console.log("Searching for user: " + req.params.userId)
   let found = false;
    for (let i = 0; i < users.length; i++) {
        if (req.params.userId == users[i].ID) {
            console.log("Found")
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
    console.log('Create user called')
    const user = req.body
    user.ID = users.length + 1;
    console.log(req.body);
    users.push(user)
    res.status(201).json({
        message: "Succesfully created user!",
        user: req.body
    })
},

validateUser(req, res, next) {
    console.log('validating user')
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
      console.log('User data is valid!')
      next()
    } catch (err) {
     console.log('This info is Invalid: ', err)
      res.status(400).json({
        message: 'Error! Please fill in all required information.',
        error: err.toString()
      })
    }
  },
}

module.exports = userController;
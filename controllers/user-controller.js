const assert = require('assert')
const users = require('../data/users')

let userController = {
  getAllUsers(req, res) {
    console.log('get all called')
    res.status(200).json({
      message: 'Succes',
      userList: users
    })
  },

  getUserById(req, res, next) {
    console.log('Get user by Id called')
    console.log('Searching for user: ' + req.params.userId)
    let item = users.filter((item) => item.ID == req.params.userId);
        if (users.length > 0){
        console.log('Found')
        res.status(201).json({
          message: 'Found user!',
          user: item[0]
        })
      } else {
        res.status(400).json({
          message: `No user found with id: ${req.params.userId}`
        })
    }
  },

  createUser(req, res) {
    console.log('Create user called')
    let ID = users.length + 1
    let user = {
     ID,
      ...req.body
    }
    console.log(user)
    users.push(user)
    res.status(201).json({
      message: 'Succesfully created user!',
      user: req.body
    })
  },

  validateUser(req, res, next) {
    console.log('validating user')
    try {
      const {
        firstName,
        lastName,
        street,
        city,
        isActive,
        emailAdress,
        password,
        phonenumber
      } = req.body
      assert(typeof firstName === 'string', 'First Name is missing!')
      assert(typeof lastName === 'string', 'Last Name is missing!')
      assert(typeof street === 'string', 'Street is missing!')
      assert(typeof city === 'string', 'City is missing!')
      assert(
        typeof isActive === 'boolean',
        'Is the user active or not? isActive is missing!'
      )
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

  changeUser(req, res) {
   let item = users.filter((item) => item.ID == req.params.userId);
   console.log(item[0])
        if (users.length > 0){
        console.log('Found')
        let Id = item[0].ID
        let user = {
          Id,
          ...req.body
        }
       users.splice(item.indexOf()-1, 1)
       users.push(user)
        res.status(200).json({
          message: 'Succesfully updated',
          old: item[0],
          new: user
        })
      } else {
        res.status(400).json({
          message: `No user found with id: ${req.params.userId}`
        })
      }
  },

  deleteUser(req, res) {
     let item = users.filter((item) => item.ID == req.params.userId);
        if (users.length > 0){
        console.log('Found user to delete')
        users.splice(item.indexOf() -1, 1)
        res.status(201).json({
          message: 'Succesfully deleted user!'
        })
      } else {
        res.status(400).json({
          message: `No user found with id: ${req.params.userId}`
        })
      }
    }
  }

module.exports = userController

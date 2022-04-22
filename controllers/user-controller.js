const database = require('../data/users')
const name = "Database: ";

module.exports = {
  //GET
  getAllUsers(req, res) {
    console.log(`${name} get all called`)
    database.sort((a, b) => a.ID - b.ID)
    res.status(200).json({
      Status: 200,
      message: 'Succesfully retrieved all users',
      hint: 'Users get sorted on ID, new users are on bottom',
      userList: database
    })
  },
  //GET
  getUserById(req, res, next) {
    console.log(`${name} Get user by Id called`)
    //Filter on requested ID
    let item = database.filter((item) => item.ID == req.params.userId);
        if (item.length > 0){
        console.log('Found')
        res.status(201).json({
          Status: 201,
          message: 'Found user!',
          user: item[0]
        })
      } else {
        res.status(400).json({
          Status: 400,
          message: `No user found with id: ${req.params.userId}`
        })
    }
  },
  //POST
  createUser(req, res) {
    console.log(`${name} Create user called`)
   let ID = database.length + 1;
    //User aanmaken met ID van database grote + 1 (zodat er nooit dezelfde ID wordt toegevoegd)
    let user = {
     ID,
      ...req.body
    }
    database.push(user)
    database.sort((a, b) => a.ID - b.ID)
    res.status(201).json({
      Status: 201,
      message: 'Succesfully created user!',
      user: req.body
    })
  },
  //PUT
  changeUser(req, res) {
   let item = database.filter((item) => item.ID == req.params.userId);
        if (item.length > 0){
          //Transfering ID from old user to new User
        let ID = item[0].ID
        let user = {
          ID,
          ...req.body
        }
        //Replacing the old with new one.
       database.splice(database.indexOf(item[0]), 1, user)
        res.status(201).json({
          Status: 201,
          message: 'Succesfully updated',
          old_info: item[0],
          new_info: user
        })
      } else {
        res.status(400).json({
          Status: 400,
          message: `No user found with id: ${req.params.userId}`
        })
      }
  },
  //DELETE
  deleteUser(req, res) {
     let item = database.filter((item) => item.ID == req.params.userId);
        if (item.length > 0){
        console.log(`${name} Found user to delete`)
        database.splice(database.indexOf(item[0]), 1)
        database.forEach((item) => {
         let number = database.indexOf(item)
         item.ID = number + 1;
        })
        res.status(201).json({
          Status: 201,
          message: 'Succesfully deleted user!',
          hint: `ID's have been Adjusted to fit their place! (Keep this in mind while checking if it worked)`
        })
      } else {
        res.status(400).json({
          Status: 400,
          message: `No user found with id: ${req.params.userId}`
        })
      }
    },

    getProfile(req, res) {
      res.status(200).json({
        Status: 200,
        Message: `This Endpoint is currently Unavailable!`
      })
    }

  }

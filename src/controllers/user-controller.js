// const database = require('../../data/users')
const name = "User controller: ";
const dbconnection = require('../../settings/database')

module.exports = {
  //GET
  getAllUsers(req, res) {
    // database.sort((a, b) => a.id - b.id)
    // database.forEach((item) => {
    //   let number = database.indexOf(item)
    //   item.id = number + 1;
    //  })
    // res.status(200).json({
    //   Status: 200,
    //   message: 'Succesfully retrieved all users',
    //   hint: 'Users get sorted on id, new users are on bottom',
    //   userList: database
    // })

    dbconnection.getConnection(function(err, connection) {
      if (err) throw err;

      connection.query('SELECT * FROM user;', function(error, results, fields) {
        connection.release();
        if (error) throw error;
        console.log('#results = ', results.length)
        res.status(200).json({
          Status: 200,
          results: results,
        })
      })
    })
},
  //GET
  getUserById(req, res) {
    //Filter on requested id
    let item = database.filter((item) => item.id == req.params.userId);
        if (item.length > 0){
        console.log('Found')
        res.status(200).json({
          Status: 200,
          message: 'Found user!',
          user: item[0]
        })
      } else {
        res.status(400).json({
          Status: 400,
          Error: `No user found with id: ${req.params.userId}`
        })
    }
  },
  //POST
  createUser(req, res) {
   let id = database.length + 1;
    //User aanmaken met id van database grootte + 1 (zodat er nooit dezelfde id wordt toegevoegd)
    let user = {
     id,
      ...req.body
    }
    database.push(user)
    database.sort((a, b) => a.id - b.id)
    res.status(201).json({
      Status: 201,
      message: 'Succesfully created user!',
      user: user
    })
  },
  //PUT
  changeUser(req, res) {
   let item = database.filter((item) => item.id == req.params.userId);
        if (item.length > 0){
          //Transfering id from old user to new User
        let id = item[0].id
        let user = {
          id,
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
          Error: `No user found with id: ${req.params.userId}`
        })
      }
  },
  //DELETE
  deleteUser(req, res) {
     let item = database.filter((item) => item.id == req.params.userId);
        if (item.length > 0){
        console.log(`${name} Found user to delete`)
        database.splice(database.indexOf(item[0]), 1)
        database.forEach((item) => {
         let number = database.indexOf(item)
         item.id = number + 1;
        })
        res.status(201).json({
          Status: 201,
          message: 'Succesfully deleted user!',
          hint: `id's have been Adjusted to fit their place! (Keep this in mind while checking if it worked)`
        })
      } else {
        res.status(400).json({
          Status: 400,
          Error: `No user found with id: ${req.params.userId}`
        })
      }
    },

    getProfile(req, res) {
      res.status(401).json({
        Status: 401,
        Error: `This Endpoint is currently Unavailable!`
      })
    },
  }

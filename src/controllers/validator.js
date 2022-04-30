const assert = require('assert')
const { Console } = require('console')
const database = require('../../database/databaseConnection')

module.exports = {
  validateUser(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        street,
        city,
        isActive,
        emailAdress,
        password,
        phoneNumber
      } = req.body

      //Check of elke value juiste formaat is
      assert(typeof firstName === 'string', 'First Name is invalid!')
      assert(typeof lastName === 'string', 'Last Name is invalid!')
      assert(typeof street === 'string', 'Street is invalid!')
      assert(typeof city === 'string', 'City is invalid!')
      assert(typeof isActive === 'boolean', 'isActive is invalid!')
      assert(typeof emailAdress === 'string', 'emailAdress is invalid!')
      assert(typeof password === 'string', 'Password is invalid!')
      assert(typeof phoneNumber == 'string', 'phoneNumber is invalid!')
      console.log('User data is valid!')
      next()
    } catch (err) {
      console.log('This info is Invalid: ', err.message)
      res.status(400).json({
        Status: 400,
        Error: err.message,
      })
    }
  },

  validateMeal(req, res, next) {
    try {
      const {
        isActive,
        isVega,
        isVegan,
        isToTakeHome,
        dateTime,
        maxAmountOfParticipants,
        price,
        imageUrl,
        cookId,
        createDate,
        updateDate,
        name,
        description,
        allergenes,
      } = req.body

      //Check values van meal!
      assert(typeof name === 'string', 'Name is invalid!')
      assert(typeof description === 'string', 'Description is invalid!')
      assert(typeof isActive === 'boolean', 'isActive is invalid!')
      assert(typeof isVega === 'boolean', 'isVega is invalid!')
      assert(typeof isVegan === 'boolean', 'isVegan is invalid!')
      assert(typeof isToTakeHome === 'boolean', 'isToTakeHome is invalid!')
      assert(typeof dateTime === 'string', 'dateTime is invalid!')
      assert(typeof imageUrl === 'string', 'imageUrl is invalid!')
      assert(typeof allergenes === 'array', 'allergenes is invalid!')
      assert(typeof maxAmountOfParticipants === 'number', 'maxAmountOfParticipants is invalid!')
      assert(typeof price === 'number', 'price is invalid!')
      assert(typeof cookId === 'number', 'cookId is invalid!')
      assert(typeof createDate === 'string', 'createDate is invalid!')
      assert(typeof updateDate === 'string', 'updateDate is invalid!')
      next();
    } catch (err) {
      res.status(400).json({
        Status: 400,
        Error: err.message,
      })
    }
  },

  validateEmail(req, res, next) {
    let email = req.body.emailAdress;
    database.getConnection(function (err, connection) {
      if (err)
        return res.status(400).json({
          Status: 400,
          Error: err
        })
      connection.query(
        `SELECT * FROM user WHERE emailAdress = "${email}";`,
        function (error, results, fields) {
          connection.release()
          console.log(results)
          if (results.length > 0) {
            if (results[0].id == req.params.userId) {
              console.log('email check passed')
              next();
            } else {
            res.status(400).json({
              Status: 400,
              Error: 'An user with this Email adress already exists!'
            })
          }
          } else {
            console.log('email check passed')
            next();
          }
        }
      )
    })

  }
}

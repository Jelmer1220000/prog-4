const assert = require('assert')
const { Console } = require('console')
const database = require('../../data/users')

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
        phonenumber
      } = req.body

      //Check of elke value juiste formaat is
      assert(typeof firstName === 'string', 'First Name is invalid!')
      assert(typeof lastName === 'string', 'Last Name is invalid!')
      assert(typeof street === 'string', 'Street is invalid!')
      assert(typeof city === 'string', 'City is invalid!')
      assert(typeof isActive === 'boolean', 'isActive is invalid!')
      assert(typeof emailAdress === 'string', 'emailAdress is invalid!')
      assert(typeof password === 'string', 'Password is invalid!')
      assert(typeof phonenumber == 'string', 'phonenumber is invalid!')
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
        name,
        description,
        isActive,
        isVega,
        isVegan,
        isToTakeHome,
        dateTime,
        imageUrl,
        allergenes,
        maxAmountOfParticipants,
        price,
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
    //Filter Database om te kijken of Email Address al bestaat (== ipv === om cijfer (int, string) problemen te voorkomen)
    let item = database.filter((item) => item.emailAdress.toLowerCase() == email.toLowerCase())
    if (item.length > 0) {
        if (req.method != 'PUT') {
        res.status(400).json({
            Status: 400,
            Error: `An user with this Email adress already exists!`
        })
    } else {
        //PUT request check if the Email is from the user the person is trying to change
        if (req.params.userId != item[0].id) {
            res.status(400).json({
                Status: 400,
                Error: `An user with this Email adress already exists!`
            })
        } else {
            console.log("Email is from same user, request accepted!")
            next()
        }
    }
    } else {
        console.log("Email check passed")
        next()
    }
  }
}

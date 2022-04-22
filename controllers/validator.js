const assert = require('assert')
const { Console } = require('console')
const database = require('../data/users')

module.exports = {
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

      //Check of elke value juiste formaat is
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
        Status: 400,
        message: 'Error! Please fill in all required information.',
        error: err.toString()
      })
    }
  },

  validateEmail(req, res, next) {
    let email = req.body.emailAdress;
    //Filter Database om te kijken of Email Address al bestaat (== ipv === om cijfer (int, string) problemen te voorkomen)
    let item = database.filter((item) => item.emailAdress == email)
    if (item.length > 0) {
        if (req.method != 'PUT') {
        res.status(400).json({
            Status: 400,
            Message: `A user with this Email adress already exists!`
        })
    } else {
        //PUT request check if the Email is from the user the person is trying to change
        if (req.params.userId != item[0].ID) {
            res.status(400).json({
                Status: 400,
                Message: `Someone else is already using this Email adress!`
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

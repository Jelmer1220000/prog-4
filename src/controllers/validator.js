const assert = require('assert')
const database = require('../../config/database/databaseConnection')
const status = require('../../config/status/userStatus')

module.exports = {
    validateUserPost(req, res, next) {
        try {
            const {
                firstName,
                lastName,
                street,
                city,
                emailAdress,
                password,
                phoneNumber,
            } = req.body
            //Check of elke value juiste formaat is
            assert(typeof firstName === 'string', 'firstName is invalid!')
            assert(typeof lastName === 'string', 'lastName is invalid!')
            assert(typeof street === 'string', 'street is invalid!')
            assert(typeof city === 'string', 'city is invalid!')
            assert(typeof emailAdress === 'string', 'emailAdress is invalid!')
            assert(typeof password === 'string', 'password is invalid!')
            assert(typeof phoneNumber == 'string', 'phoneNumber is invalid!')
            next()
        } catch (err) {
            return status.invalidBody(req, res, err.message)
        }
    },

    validateUserPut(req, res, next) {
        try {
            const {
                emailAdress,
                phoneNumber,
            } = req.body
            //Check of elke value juiste formaat is
            assert(typeof emailAdress === 'string', 'emailAdress is invalid!')
            assert(typeof phoneNumber == 'string', 'phoneNumber is invalid!')
            next()
        } catch (err) {
            return status.invalidBody(req, res, err.message)
        }
    },

    validateMeal(req, res, next) {
        try {
            const {
                name,
                description,
                imageUrl,
                maxAmountOfParticipants,
                price,
            } = req.body
            req.body.cookId = req.userId
            //Check values van meal!
            assert(typeof name === 'string', 'Name is invalid!')
            assert(typeof description === 'string', 'Description is invalid!')
            assert(typeof imageUrl === 'string', 'imageUrl is invalid!')
            assert(typeof maxAmountOfParticipants === 'number', 'maxAmountOfParticipants is invalid!')
            assert(typeof price === 'number', 'price is invalid!')
            next()
        } catch (err) {
            return status.invalidBody(req, res, err.message)
        }
    },

    validatePassword(req, res, next) {
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[!@#$%^&*])))(?=.{8,})");
        let password = req.body.password

        if (mediumRegex.test(password)) {
            next();
        } else {
            return status.invalidPassword(req, res);
        }
    },

    validateEmail(req, res, next) {
        let forbidden = ['#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+']
        let progress = true
        let email = req.body.emailAdress
        if (email == null || !email.includes('@')) {
            return status.emailInvalid(req, res)
        }
        forbidden.forEach((letter) => {
            if (email.includes(letter)) {
                progress = false
            }
        })
        if (progress != true) {
            return status.emailInvalid(req, res)
        }
        database.getConnection(function (err, connection) {
            if (err) return status.databaseError(req, res, err.message)
            connection.query(
                `SELECT * FROM user WHERE emailAdress = '${email}';`,
                function (error, results, fields) {
                    connection.release()
                    if (results.length == 0 || (results[0].id == req.params.id)) {
                            next()
                        } else {
                            return status.emailExists(req, res)
                        }
                }
            )
        })
    },
}

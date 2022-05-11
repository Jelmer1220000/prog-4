const assert = require('assert')
const database = require('../database/databaseConnection')
const status = require('../controllers/status')

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
                firstName,
                lastName,
                street,
                city,
                emailAdress,
                password,
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
                // isToTakeHome,
                dateTime,
                imageUrl,
                maxAmountOfParticipants,
                price,
                // allergenes,
                cookId,
            } = req.body

            //Check values van meal!
            assert(typeof name === 'string', 'Name is invalid!')
            assert(typeof description === 'string', 'Description is invalid!')
            // assert(typeof isToTakeHome === 'boolean','isToTakeHome is invalid!')
            assert(typeof dateTime === 'string', 'dateTime is invalid!')
            assert(typeof imageUrl === 'string', 'imageUrl is invalid!')
            // assert(Array.isArray(allergenes), 'allergenes is invalid!')
            assert(
                typeof maxAmountOfParticipants === 'number',
                'maxAmountOfParticipants is invalid!'
            )
            assert(typeof price === 'number', 'price is invalid!')
            assert(typeof cookId === 'number', 'cookId is invalid!')
            next()
        } catch (err) {
            return status.invalidBody(req, res, err.message)
        }
    },

    validateEmail(req, res, next) {
        let forbidden = ['#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+']
        let progress = true
        let email = req.body.emailAdress
        if (email == null) {
            console.log(5, req.body)
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
            if (err) status.databaseError(req, res, err.message)
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

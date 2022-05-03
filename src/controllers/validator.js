const assert = require('assert')
const { type } = require('express/lib/response')
const database = require('../database/databaseConnection')

module.exports = {
    validateUser(req, res, next) {
        try {
            const {
                firstName,
                lastName,
                street,
                city,
                // isActive,
                emailAdress,
                password,
                phoneNumber,
            } = req.body

            //Check of elke value juiste formaat is
            assert(typeof firstName === 'string', 'firstName is invalid!')
            assert(typeof lastName === 'string', 'lastName is invalid!')
            assert(typeof street === 'string', 'street is invalid!')
            assert(typeof city === 'string', 'city is invalid!')
            // assert(typeof isActive === 'integer', 'isActive is invalid!')
            assert(typeof emailAdress === 'string', 'emailAdress is invalid!')
            assert(typeof password === 'string', 'password is invalid!')
            assert(typeof phoneNumber == 'string', 'phoneNumber is invalid!')
            next()
        } catch (err) {
            res.status(400).json({
                Status: 400,
                Error: err.message,
            })
        }
    },

    validateMeal(req, res, next) {
        try {
            const {
                // isToTakeHome,
                dateTime,
                maxAmountOfParticipants,
                price,
                imageUrl,
                name,
                description,
                // allergenes,
                cookId
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
            res.status(400).json({
                Status: 400,
                Error: err.message,
            })
        }
    },

    validateEmail(req, res, next) {
        let forbidden = ['#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+']
        let progress = true
        let email = req.body.emailAdress
        forbidden.forEach((letter) => {
            if (email.includes(letter)) {
                progress = false
            }
        })
        if (progress == true) {
            database.getConnection(function (err, connection) {
                if (err)
                    return res.status(400).json({
                        Status: 400,
                        Error: err,
                    })
                connection.query(
                    `SELECT * FROM user WHERE emailAdress = "${email}";`,
                    function (error, results, fields) {
                        connection.release()
                        if (results.length > 0) {
                            if (results[0].id == req.params.userId) {
                                next()
                            } else {
                                res.status(400).json({
                                    Status: 400,
                                    Error: 'An user with this Email adress already exists!',
                                })
                            }
                        } else {
                            next()
                        }
                    }
                )
            })
        } else {
            res.status(400).json({
                Status: 400,
                Error: 'emailAdress contains a forbidden symbol!',
            })
        }
    },
}

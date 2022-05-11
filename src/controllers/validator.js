const assert = require('assert')
const database = require('../database/databaseConnection')

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
            res.status(400).json({
                Status: 400,
                message: err.message,
            })
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
            console.log(req.body)
            //Check of elke value juiste formaat is
            assert(typeof emailAdress === 'string', 'emailAdress is invalid!')
            assert(typeof phoneNumber == 'string', 'phoneNumber is invalid!')
            next()
            } catch (err) {
            res.status(400).json({
                Status: 400,
                message: err.message,
            })
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
        let progress = true;
        let email = req.body.emailAdress
        if (email == null) {
            return res.status(400).json({
                Status: 400,
                message: `Email is invalid`
            })
        }
        console.log(email)
        forbidden.forEach((letter) => {
            if (email.includes(letter)) {
                 progress = false;
            }
        })
        if (progress != true) {
            return res.status(400).json({
                Status: 400,
                message: 'emailAdress contains a forbidden symbol!',
            })
        }
            database.getConnection(function (err, connection) {
                if (err)
                    return res.status(400).json({
                        Status: 400,
                        message: err,
                    })
                connection.query(
                    `SELECT * FROM user WHERE emailAdress = '${email}';`,
                    function (error, results, fields) {
                        connection.release()
                        if (results.length > 0) {
                            console.log(results)
                            if (results[0].id == req.params.userId) {
                                next()
                            } else {
                                return res.status(409).json({
                                    Status: 409,
                                    message: 'An user with this Email adress already exists!',
                                })
                            }
                        } else {
                            next()
                        }
                    }
                )
            })
        },
    }

const assert = require('assert')
const database = require('../../config/database/databaseConnection')
const dbstatus = require('../../config/status/databaseStatus')
const Ustatus = require('../../config/status/userStatus')
const Mstatus = require('../../config/status/mealStatus')

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
            return Ustatus.invalidBody(req, res, err.message)
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
            return Ustatus.invalidBody(req, res, err.message)
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
            return Ustatus.invalidBody(req, res, err.message)
        }
    },

    validatePassword(req, res, next) {
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[!@#$%^&*])))(?=.{8,})");
        let password = req.body.password

        if (mediumRegex.test(password)) {
            next();
        } else {
            return Ustatus.invalidPassword(req, res);
        }
    },

    validateEmail(req, res, next) {
        let email = req.body.emailAdress

        database.getConnection(function (err, connection) {
            if (err) return Ustatus.databaseError(req, res, err.message)
            connection.query(
                `SELECT * FROM user WHERE emailAdress = '${email}';`,
                function (error, results, fields) {
                    connection.release()
                    if (results.length == 0 || (results[0].id == req.params.id)) {
                            next()
                        } else {
                            return Ustatus.emailExists(req, res)
                        }
                }
            )
        })
    },

    validateEmailFormat(req, res, next) {
        let email = req.body.emailAdress
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if (regex.test(email)) next();
        else Ustatus.emailInvalid(req, res)
    },

    validatePhone(req, res, next) {
        let phone = req.body.phoneNumber
        let regex = new RegExp(/^\+(?:[0-9] ?){6,14}[0-9]$/);
        if (regex.test(phone)) next();
        else Ustatus.phoneInvalid(req, res)
    },

    validateOwnerMeal(req, res, next) {
        database.getConnection(function (err, connection) {
            if (err) return dbstatus.databaseError(req, res, err)

            if (!Number(req.params.mealId))
            return Mstatus.mealNotFound(req, res, 400)

            connection.query(
                `SELECT * FROM meal WHERE id = ${req.params.mealId};`,
                function (error, meal, fields) {
                    connection.release();
                    if (error) return dbstatus.databaseError(req, res, error)
                    if (meal.length > 0 && meal[0].cookId != req.userId)
                        return Mstatus.notOwner(req, res)
                    else {
                        next();
                    }
                })
            })
    },

    validateOwnerUser(req, res, next) {
        database.getConnection(function (err, connection) {
            if (err) return dbstatus.databaseError(req, res, err)
            if (!Number(req.params.id)) {
                return Ustatus.userNotFound(req, res, 400)
            }
            connection.query(
                `SELECT * FROM user WHERE id = ${req.params.id};`,
                function (error, users, fields) {
                    if (error) return dbstatus.databaseError(req, res, error)
                    if (users.length == 0) return Ustatus.userNotFound(req, res, 400)
                    if (users[0].id != req.userId)
                        return Ustatus.notOwner(req, res)
                    else {
                        next();
                    }
                })
            });
    }

}

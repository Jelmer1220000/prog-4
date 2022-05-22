var jwt = require('jsonwebtoken')
const assert = require('assert')
const jwtSecretKey = require('../../config/config').jwtSecretKey
const database = require('../../config/database/databaseConnection')
const databaseStatus = require('../../config/status/databaseStatus')
const authS = require('../../config/status/authStatus')

module.exports = {
    login(req, res, next) {
        let forbidden = ['#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+']
        let progress = true
        let email = req.body.emailAdress
        if (email == null || !email.includes('@')) {
            return authS.emailInvalid(req, res)
        }
        forbidden.forEach((letter) => {
            if (email.includes(letter)) {
                progress = false
            }
        })
        if (progress != true) {
            return authS.emailInvalid(req, res)
        }

        database.getConnection((err, connection) => {
            if (err) return databaseStatus.databaseError(req, res, err)

            connection.query(
                'SELECT * FROM user Where emailAdress = ?',
                [req.body.emailAdress],
                (err, rows, fields) => {
                    connection.release()
                    if (err) return databaseStatus.databaseError(req, res, err)

                    if (rows.length == 1) {
                        if (rows[0].password == req.body.password) {
                        const { password, ...userinfo } = rows[0]
                        // Create an object containing the data we want in the payload.
                        const payload = {
                            userId: userinfo.id,
                        }

                        jwt.sign(
                            payload,
                            jwtSecretKey,
                            { expiresIn: '12d' },
                            function (err, token) {
                                let person = {
                                    ...userinfo,
                                    token,
                                }
                                //Login called
                                return authS.userLogin(req, res, person)
                            }
                        )
                    } else {
                        return authS.wrongPassword(req, res)
                    }
                } else {
                    return authS.userNotFound(req, res)
                }
            }
            )
        })
    },

    validateLogin(req, res, next) {
        // Verify that we receive the expected input
        try {
            assert(
                typeof req.body.emailAdress === 'string',
                'email must be a string.'
            )
            assert(
                typeof req.body.password === 'string',
                'password must be a string.'
            )
            next()
        } catch (ex) {
            return authS.wrongValidation(req, res, ex)
        }
    },

    validateToken(req, res, next) {
        const authHeader = req.headers.authorization
        if (!authHeader) {
          return authS.headerMissing(req, res)
        } else {
            // Strip the word 'Bearer ' from the headervalue
            const token = authHeader.substring(7, authHeader.length)

            jwt.verify(token, jwtSecretKey, (err, payload) => {
                if (err) {
                   return authS.unAuthorized(req, res)
                }
                if (payload) {
                    req.userId = payload.userId
                    next()
                }
            })
        }
    },
}

const name = 'User controller: '
const database = require('../database/databaseConnection')
const status = require('./status')
module.exports = {
    //GET
    getAllUsers(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return status.databaseError(req, res, err)
            let amount = 10000
            let lastName = '%'
            let isActive = '%'
            if (Object.keys(req.query).length != 0) {
                if (req.query.lastName != null) {
                    lastName = req.query.lastName
                }
                if (req.query.length != null) {
                    amount = req.query.length
                }
                if (req.query.active != null) {
                    if (req.query.active == 'true') {
                        isActive = '1'
                    } else {
                        isActive = '0'
                    }
                }
            }

            connection.query(
                `SELECT * FROM user WHERE lastName LIKE '${lastName}' && isActive LIKE '${isActive}' LIMIT ${amount};`,
                function (error, results, fields) {
                    connection.release()
                    if (error) return console.log(error)
                    if (results) {
                        return status.returnList(req, res, results, 200)
                    } else {
                        return status.userNotFound(req, res, 400)
                    }
                }
            )
        })
    },
    //GET
    getUserById(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return status.databaseError(req, res, err)
            if (!Number(req.params.id)) {
                console.log(3, req.body)
                return status.userNotFound(req, res, 404)
            }
            connection.query(
                `SELECT * FROM user WHERE id = ${req.params.id};`,
                function (error, results, fields) {
                    if (error) return console.log(error)
                    connection.release()
                    if (results.length > 0) {
                        return status.returnOne(req, res, results[0], 200)
                    } else {
                        console.log(4, req.body)
                        return status.userNotFound(req, res, 404)
                    }
                }
            )
        })
    },
    //POST
    createUser(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return status.databaseError(req, res, err)
            let body = req.body
            let query = `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, street, city) VALUES (?)`
            var values = [
                body.firstName,
                body.lastName,
                body.isActive,
                body.emailAdress,
                body.password,
                body.phoneNumber,
                body.street,
                body.city,
            ]
            connection.query(
                query,
                [values],
                function (error, results, fields) {
                    if (error)
                        return status.databaseError(req, res, error)
                    connection.release()
                    if (results.affectedRows > 0) {
                        let id = results.insertId
                        let person = {
                            id: id,
                            ...body,
                        }

                        return status.returnOne(req, res, person, 201)
                    } else {
                        return status.createFail(req, res)
                    }
                }
            )
        })
    },
    //PUT
    changeUser(req, res, next) {
        database.getConnection(function (err, connection) {
            if (err) console.log(err)
            if (err) return status.databaseError(req, res, err)
            if (!Number(req.params.id)) {
                console.log(1, req.body)
                return status.userNotFound(req, res, 400)
            }
            let querypart = `UPDATE user SET`
            let userReq = req.body
            Object.keys(userReq).map(function (key) {
                querypart =
                    querypart + ' ' + key + ' = ' + `'${userReq[key]}', `
            })
            querypart = querypart.slice(0, querypart.length - 2)
            querypart = querypart + ` WHERE id = ${req.params.id};`
            connection.query(querypart, function (error, results, fields) {
                if (error) return status.databaseError(req, res, err)
                connection.release()
                if (results.changedRows > 0) {
                    next()
                } else {
                    console.log(2, req.body)
                    return status.userNotFound(req, res, 400)
                }
            })
        })
    },
    //DELETE
    deleteUser(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return status.databaseError(req, res, err)
            if (!Number(req.params.id)) {
                return status.userNotFound(req, res, 400)
            }
            let query = `DELETE FROM user WHERE id = ${req.params.id}`

            connection.query(query, function (error, results, fields) {
                if (error) return status.databaseError(req, res, results)
                connection.release()
                if (results.affectedRows > 0) {
                    return status.returnDelete(req, res)
                } else {
                    return status.userNotFound(req, res, 400)
                }
            })
        })
    },

    getProfile(req, res) {
        return status.noEndpoint(req, res)
    },
}

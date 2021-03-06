const name = 'User controller: '
const database = require('../../config/database/databaseConnection')
const status = require('../../config/status/userStatus')
const dbstatus = require('../../config/status/databaseStatus')
module.exports = {
    //GET
    getAllUsers(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return dbstatus.databaseError(req, res, err)
            let amount = 10000
            let firstName = '%'
            let isActive = '%'
            if (Object.keys(req.query).length != 0) {
                if (req.query.firstName != null) {
                    firstName = req.query.firstName
                }
                if (req.query.length != null) {
                    amount = req.query.length
                }
                if (req.query.isActive != null) {
                    if (req.query.isActive == 'true') {
                        isActive = '1'
                    } else {
                        isActive = '0'
                    }
                }
            }

            connection.query(
                `SELECT * FROM user WHERE firstName LIKE '${firstName}' && isActive LIKE '${isActive}' LIMIT ${amount};`,
                function (error, results, fields) {
                    connection.release()
                    if (error) return dbstatus.databaseError(req, res, error)
                    if (results) {
                        results.forEach((person) => {
                            if (person.isActive == 1) {
                                person.isActive = true;
                            } else {
                                person.isActive = false;
                            }
                        })
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
            if (err) return dbstatus.databaseError(req, res, err)
            if (!Number(req.params.id)) {
                return status.userNotFound(req, res, 404)
            }
            connection.query(
                `SELECT * FROM user WHERE id = ${req.params.id};`,
                function (error, results, fields) {
                    if (error) return dbstatus.databaseError(req, res, error)
                    connection.release()
                    if (results.length > 0) {
                        return status.returnOne(req, res, results[0], 200)
                    } else {
                        return status.userNotFound(req, res, 404)
                    }
                }
            )
        })
    },
    //POST
    createUser(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return dbstatus.databaseError(req, res, err)
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
                    if (error) return dbstatus.databaseError(req, res, error)
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
            if (err) return dbstatus.databaseError(req, res, err)
            if (!Number(req.params.id)) {
                return status.userNotFound(req, res, 400)
            }

            connection.query(
                `SELECT * FROM user WHERE id = ${req.params.id};`,
                function (error, users, fields) {
                    if (error) return dbstatus.databaseError(req, res, error)
                    if (users.length == 0) return status.userNotFound(req, res, 400)
                    if (users[0].id != req.userId)
                        return status.notOwner(req, res)
                    else {
                        connection.query(
                            'UPDATE `user` SET ? WHERE `id` = ?',
                            [req.body, req.userId],
                            function (error, results, fields) {
                                if (error)
                                    return dbstatus.databaseError(req, res, err)
                                connection.release()
                                if (results.changedRows > 0) {
                                    next()
                                } else {
                                    return status.userNotFound(req, res, 400)
                                }
                            }
                        )
                    }
                }
            )
        })
    },
    //DELETE
    deleteUser(req, res) {
        database.getConnection(function (err, connection) {
            let query = `DELETE FROM user WHERE id = ${req.params.id}`
            connection.query(query, function (error, results, fields) {
                if (error) return dbstatus.databaseError(req, res, results)
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
        database.getConnection((err, connection) => {
            if (err) dbstatus.databaseError(req, res, err)
            connection.query(
                `SELECT * FROM user WHERE id = ${req.userId};`,
                (error, results, fields) => {
                    if (error) return dbstatus.databaseError(req, res, error)
                    if (results.length > 0) {
                        return status.returnOne(req, res, results[0], 200)
                    } else {
                        return status.userNotFound(req, res, 400)
                    }
                }
            )
        })
    },

    clearDB(req, res) {
        database.getConnection(function (err, connection) {
            let query = `DELETE FROM user WHERE firstName LIKE 'Ristretto';`
            let query2 = `DELETE FROM meal WHERE id > 10;`
            connection.query(query2 + query, function (error, results, fields) {
                if (error) return dbstatus.databaseError(req, res, error)
                connection.release()
                if (results) {
                  return res.status(200).json({
                        Status: 200,
                        message: `Succesfully deleted: Ristretto`,
                    })
                } else {
                    return status.userNotFound(req, res, 400)
                }
            })
        })
    }
}

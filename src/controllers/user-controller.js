const name = 'User controller: '
const database = require('../database/databaseConnection')
module.exports = {
    //GET
    getAllUsers(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })
            connection.query('SELECT * FROM user;', function (error, results, fields) {
                    connection.release()
                    if (results) {
                        return res.status(200).json({
                            Status: 200,
                            results: results,
                        })
                    } else {
                        res.status(400).json({
                            Status: 400,
                            Error: 'This endpoint is unavailable right now!',
                        })
                    }
                }
            )
        })
    },
    //GET
    getUserById(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })
                //log
                console.log(req.params.userId)
            connection.query(`SELECT * FROM user WHERE id = "${req.params.userId}";`, function (error, results, fields) {
                if (error) return console.log(error)
                    console.log(results)
                    console.log(fields)
                    connection.release()
                    if (results.length > 0) {
                        console.log(results)
                        return res.status(200).json({
                            Status: 200,
                            results: results[0],
                        })
                    } else {
                        res.status(400).json({
                            Status: 400,
                            Error: 'There is no user with this id!',
                        })
                    }
                }
            )
        })
    },
    //POST
    createUser(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })
            let body = req.body
            let query = `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES ?`
            var values = [
                [
                    body.firstName,
                    body.lastName,
                    body.isActive,
                    body.emailAdress,
                    body.password,
                    body.phoneNumber,
                    body.roles,
                    body.street,
                    body.city,
                ],
            ]
            connection.query(
                query,
                [values],
                function (error, results, fields) {
                    if (error)
                        return res.status(400).json({
                            Status: 400,
                            Error: `Your body is Invalid: ${err.sqlMessage}`,
                        })
                    connection.release()
                    if (results.affectedRows > 0) {
                        return res.status(200).json({
                            Status: 200,
                            result: 'Succesfully created user!',
                        })
                    } else {
                        //Never happens due to assert tests
                        res.status(400).json({
                            Status: 400,
                            Error: 'Could not create user!',
                            body: req.body,
                        })
                    }
                }
            )
        })
    },
    //PUT
    changeUser(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })
            let body = req.body

            var query = `UPDATE user SET firstName = '${body.firstName}', lastName = '${body.lastName}', isActive = '${body.isActive}', emailAdress = '${body.emailAdress}', password = '${body.password}', phoneNumber = '${body.phoneNumber}', roles = '${body.roles}', street = '${body.street}', city = '${body.city}' WHERE id = ${req.params.userId}`

            connection.query(query, function (error, results, fields) {
                if (error)
                    return res.status(400).json({
                        Status: 400,
                        Error: `Your body is Invalid: ${error.sqlMessage}`,
                    })
                connection.release()
                if (results.changedRows > 0) {
                    return res.status(200).json({
                        Status: 200,
                        results: `Succesfully updated user ${req.params.userId}`,
                    })
                } else {
                    res.status(400).json({
                        Status: 400,
                        results: `No user found with id: ${req.params.userId}`,
                    })
                }
            })
        })
    },
    //DELETE
    deleteUser(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })

            let query = `DELETE FROM user WHERE id = ${req.params.userId}`

            connection.query(query, function (error, results, fields) {
                if (error)
                    return res.status(400).json({
                        Status: 400,
                        Error: error,
                    })
                connection.release()
                if (results.affectedRows > 0) {
                    return res.status(200).json({
                        Status: 200,
                        results: `Succesfully deleted user ${req.params.userId}`,
                    })
                } else {
                    res.status(400).json({
                        Status: 400,
                        results: `No user found with id: ${req.params.userId}!`,
                    })
                }
            })
        })
    },

    getProfile(req, res) {
        res.status(401).json({
            Status: 401,
            Error: `This Endpoint is currently Unavailable!`,
        })
    },
}

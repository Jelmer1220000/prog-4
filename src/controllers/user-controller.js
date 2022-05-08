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
                let amount = 1000;
                let lastName = '%';
                let isActive = '%';
                console.log(req.query)
                if (Object.keys(req.query).length != 0) {
                    if (req.query.lastName != null){
                        lastName = req.query.lastName;
                    }
                    if (req.query.length != null){
                        amount = req.query.length;
                    }
                    if (req.query.active != null) {
                        if (req.query.active == 'true') {
                            isActive = '1';
                        } else {
                            isActive = '0';
                        }
                    }
                }
            connection.query(`SELECT * FROM user WHERE lastName LIKE '${lastName}' && isActive LIKE '${isActive}' LIMIT ${amount};`, function (error, results, fields) {
                    connection.release()
                    if (error) return console.log(error)
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
            connection.query(`SELECT * FROM user WHERE id = ${req.params.userId};`, function (error, results, fields) {
                if (error) return console.log(error)
                    connection.release()
                    if (results.length > 0) {
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
                        result: `Succesfully updated user ${req.params.userId}`,
                    })
                } else {
                    res.status(400).json({
                        Status: 400,
                        Error: `No user found with id: ${req.params.userId}`,
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
                        result: `Succesfully deleted user: ${req.params.userId}`,
                    })
                } else {
                    res.status(400).json({
                        Status: 400,
                        Error: `No user found with id: ${req.params.userId}!`,
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

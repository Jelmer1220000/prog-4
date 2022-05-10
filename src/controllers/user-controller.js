const name = 'User controller: '
const database = require('../database/databaseConnection')
module.exports = {
    //GET
    getAllUsers(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    message: err,
                })
                let amount = 10000;
                let lastName = '%';
                let isActive = '%';
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
                            message: 'This endpoint is unavailable right now!',
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

                if (!Number(req.params.id)){
                    return res.status(400).json({
                        Status: 400,
                        message: `No user found with id: ${req.params.id}!`
                    })
                }
            connection.query(`SELECT * FROM user WHERE id = ${req.params.id};`, function (error, results, fields) {
                if (error) return console.log(error)
                    connection.release()
                    if (results.length > 0) {
                        return res.status(200).json({
                            Status: 200,
                            result: results[0],
                        })
                    } else {
                        res.status(404).json({
                            Status: 404,
                            message: 'There is no user with this id!',
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
                    message: err,
                })
            let body = req.body
            let query = `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, street, city) VALUES (?)`
            var values =
                [
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
                    console.log(results)
                    if (error)
                        return res.status(400).json({
                            Status: 400,
                            message: `Your body is Invalid: ${err.sqlMessage}`,
                        })
                    connection.release()
                    if (results.affectedRows > 0) {
                        let id = results.insertId;
                        let person = {
                        'id': id, 
                        ...body}

                        return res.status(201).json({
                            Status: 201,
                            result: person
                        })
                    } else {
                        //Never happens due to assert tests
                        res.status(400).json({
                            Status: 400,
                            message: 'Could not create user!',
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
                    message: err,
                })
            let body = req.body
            if (!Number(req.params.id)){
                return res.status(400).json({
                    Status: 400,
                    message: `No user found with id: ${req.params.id}!`
                })
            }
            var query = `UPDATE user SET firstName = '${body.firstName}', lastName = '${body.lastName}', isActive = '${body.isActive}', emailAdress = '${body.emailAdress}', password = '${body.password}', phoneNumber = '${body.phoneNumber}', roles = '${body.roles}', street = '${body.street}', city = '${body.city}' WHERE id = ${req.params.id}`

            connection.query(query, function (error, results, fields) {
                if (error)
                    return res.status(400).json({
                        Status: 400,
                        message: `Your body is Invalid: ${error.sqlMessage}`,
                    })
                connection.release()
                if (results.changedRows > 0) {
                    return res.status(200).json({
                        Status: 200,
                        result: `Succesfully updated user ${req.params.id}`,
                    })
                } else {
                    res.status(400).json({
                        Status: 400,
                        message: `User does not exist`,
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
                    message: err,
                })
                if (!Number(req.params.id)){
                    return res.status(400).json({
                        Status: 400,
                        message: `No user found with id: ${req.params.id}!`
                    })
                }

            let query = `DELETE FROM user WHERE id = ${req.params.id}`

            connection.query(query, function (error, results, fields) {
                if (error)
                    return res.status(400).json({
                        Status: 400,
                        message: error,
                    })
                connection.release()
                if (results.affectedRows > 0) {
                    return res.status(200).json({
                        Status: 200,
                        result: `Succesfully deleted user: ${req.params.id}`,
                    })
                } else {
                    res.status(400).json({
                        Status: 400,
                        message: `User does not exist`,
                    })
                }
            })
        })
    },

    getProfile(req, res) {
        res.status(404).json({
            Status: 404,
            message: `This Endpoint is currently Unavailable!`,
        })
    },
}

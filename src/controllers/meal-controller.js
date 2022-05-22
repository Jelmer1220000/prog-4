const database = require('../../config/database/databaseConnection')
const status = require('../../config/status/mealStatus')
const databaseStatus = require('../../config/status/databaseStatus')

module.exports = {
    getAllMeals(req, res) {
        let fullMeals = []
        database.getConnection(function (err, connection) {
            if (err) return databaseStatus.databaseError(req, res, err.message)
            connection.query(
                'SELECT * FROM meal;',
                function (error, meals, fields) {
                    let length = meals.length
                    let run = 0
                    if (meals.length > 0) {
                        meals.forEach((meal) => {
                            connection.query(
                                `SELECT * FROM user WHERE id = ${meal.cookId};`,
                                function (error, results, fields) {
                                    if (error)
                                        return databaseStatus.databaseError(
                                            req,
                                            res,
                                            error
                                        )
                                    connection.release()
                                    if (results.length > 0) {
                                        let cook = results[0]

                                        connection.query(
                                            `SELECT user.id, firstName, lastName, emailAdress, password, phoneNumber, roles, street, city FROM user RIGHT JOIN meal_participants_user ON user.id = meal_participants_user.userId RIGHT JOIN meal ON meal_participants_user.mealId = meal.id WHERE meal.id = ${meal.id}`,
                                            function (error, users, fields) {
                                                let mealInfo
                                                if (users[0].id != null) {
                                                    mealInfo = {
                                                        ...meal,
                                                        cook: cook,
                                                        participants: users,
                                                    }
                                                } else {
                                                    mealInfo = {
                                                        ...meal,
                                                        cook: cook,
                                                    }
                                                }
                                                fullMeals.push(mealInfo)
                                                run++
                                                if (run == length) {
                                                    return status.returnList(
                                                        req,
                                                        res,
                                                        fullMeals,
                                                        200
                                                    )
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        })
                    } else {
                        return status.noEndpoint(req, res)
                    }
                }
            )
        })
    },
    //GET
    getMealById(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return databaseStatus.databaseError(req, res, err.message)
            connection.query(
                `SELECT * FROM meal WHERE id = ${req.params.mealId};`,
                function (error, meal, fields) {
                    if (error) return databaseStatus.databaseError(req, res, error)
                    if (meal.length > 0) {
                        let query = `SELECT user.id, firstName, lastName, emailAdress, phoneNumber, roles, street, city FROM user RIGHT JOIN meal_participants_user ON user.id = meal_participants_user.userId RIGHT JOIN meal ON meal_participants_user.mealId = meal.id WHERE meal.id = ${req.params.mealId}`
                        connection.query(
                            query,
                            function (error, users, fields) {
                                let fullMeal
                                if (users[0].id != null) {
                                    fullMeal = {
                                        ...meal[0],
                                        participants: users,
                                    }
                                } else {
                                    fullMeal = { ...meal[0] }
                                }
                                this.fullMeals = fullMeal
                                return status.returnOne(req, res, fullMeal, 200)
                            }
                        )
                    } else {
                        return status.mealNotFound(req, res, 404)
                    }
                }
            )
        })
    },
    //POST
    createMeal(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return databaseStatus.databaseError(req, res, err.message)
            let body = req.body
            let query =
                'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES ?'
            var values = [
                [
                    body.id,
                    body.name,
                    body.description,
                    body.imageUrl,
                    Date.now(),
                    body.maxAmountOfParticipants,
                    body.price,
                    req.userId,
                ],
            ]
            connection.query(
                query,
                [values],
                function (error, results, fields) {
                    if (error) return databaseStatus.databaseError(req, res, error)
                    connection.release()
                    if (results.affectedRows > 0) {
                        let meal = {
                            id: results.insertId,
                            ...req.body,
                        }
                        return status.returnOne(req, res, meal, 201)
                    } else {
                        return status.createFail(req, res)
                    }
                }
            )
        })
    },
    //PUT
    changeMeal(req, res, next) {
        database.getConnection(function (err, connection) {
            if (err) return databaseStatus.databaseError(req, res, err)

            connection.query(
                `SELECT * FROM meal WHERE id = ${req.params.mealId};`,
                function (error, meal, fields) {
                    if (error) return databaseStatus.databaseError(req, res, error)
                    if (meal.length > 0 && meal[0].cookId != req.userId)
                        return status.notOwner(req, res)
                    else {
                        if (!req.body.allergenes == null) {
                            req.body.allergenes = [req.body.allergenes]
                        }
                        if (!Number(req.params.mealId))
                            return status.mealNotFound(req, res, 400)
                        connection.query(
                            'UPDATE `meal` SET ? WHERE `id` = ?',
                            [req.body, req.params.mealId],
                            function (error, results, fields) {
                                if (error)
                                    return databaseStatus.databaseError(
                                        req,
                                        res,
                                        error
                                    )
                                connection.release()
                                if (results.changedRows > 0) {
                                    next()
                                } else {
                                    return status.mealNotFound(req, res, 404)
                                }
                            }
                        )
                    }
                }
            )
        })
    },
    //DELETE
    deleteMeal(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return databaseStatus.databaseError(req, res, err)

            connection.query(
                `SELECT * FROM meal WHERE id = ${req.params.mealId};`,
                function (error, meal, fields) {
                    if (error)
                        return databaseStatus.databaseError(req, res, error)
                    if (meal.length > 0) {
                        if (meal[0].cookId != req.userId)
                            return status.notOwner(req, res)
                        if (!Number(req.params.mealId))
                            return status.mealNotFound(req, res, 400)

                        connection.query(
                            `DELETE FROM meal WHERE id = ${req.params.mealId}`,
                            function (error, result, fields) {
                                if (error)
                                    return databaseStatus.databaseError(
                                        req,
                                        res,
                                        error.sqlMessage
                                    )
                                connection.release()
                                if (result.affectedRows > 0) {
                                    return status.returnDelete(req, res)
                                } else {
                                    return status.mealNotFound(req, res, 404)
                                }
                            }
                        )
                    } else {
                        return status.mealNotFound(req, res, 404)
                    }
                }
            )
        })
    },

    partcipate(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return databaseStatus.databaseError(req, res, err)
            connection.query(
                `SELECT * FROM meal_participants_user WHERE mealId = ${req.params.mealId};`,
                function (error, rows, fields) {
                    if (error) return databaseStatus.databaseError(req, res, error)
                    if (rows.length == 0) return status.mealNotFound(req, res, 404)
                    let participating = false
                    rows.forEach((row) => {
                        if (row.userId == req.userId) {
                            participating = true
                        }
                    })
                    console.log("test: 3")
                    let query = '';
                    let isparticipating = false;
                    if (participating == true) {
                        query = `DELETE FROM meal_participants_user WHERE userId = ${req.userId}`;
                    } else {
                        isparticipating = true;
                        query =
                        `INSERT INTO meal_participants_user (mealId, userId) VALUES (${req.params.mealId}, ${req.userId})`
                    var values = [
                        [
                            req.params.mealId,
                            req.userId,
                        ],
                    ]
                }      
                console.log("test: 4")
                        connection.query(
                            query,
                            function (error, result, fields) {
                                if (error)
                                    return databaseStatus.databaseError(
                                        req,
                                        res,
                                        error
                                    )
                                if (result.affectedRows > 0) {
                                    connection.query(
                                        `SELECT mealId, count(userId) AS users FROM meal_participants_user WHERE mealId = ${req.params.mealId}`,
                                        function (error, results, fields) {
                                            if (error) return databaseStatus.databaseError(
                                                    req,
                                                    res,
                                                    error
                                                )
                                            if (results.length > 0) {
                                                let result = {
                                                    currentlyParticipating: isparticipating,
                                                    currentAmountOfParticipants:
                                                        results[0].users,
                                                }
                                                return status.returnParticipate(
                                                    req,
                                                    res,
                                                    result
                                                )
                                            } else {
                                                return status.noEndpoint(req, res)
                                            }
                            })
                                } else {
                                    return status.noEndpoint(req, res)
                                }
                    })
        })
    })
    },
}

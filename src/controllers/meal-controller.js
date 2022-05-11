const database = require('../database/databaseConnection')
const status = require('./status')
module.exports = {
    getAllMeals(req, res) {
        let fullMeals = []
        database.getConnection(function (err, connection) {
            if (err) status.databaseError(req, res, err.message)
            connection.query(
                'SELECT * FROM meal;',
                function (error, meals, fields) {
                    let length = meals.length
                    let run = 0
                    if (meals.length > 0) {
                        meals.forEach((meal) => {
                            let query = `SELECT user.id, firstName, lastName, emailAdress, password, phoneNumber, roles, street, city FROM user RIGHT JOIN meal_participants_user ON user.id = meal_participants_user.userId RIGHT JOIN meal ON meal_participants_user.mealId = meal.id WHERE meal.id = ${meal.id}`
                            connection.query(
                                query,
                                function (error, users, fields) {
                                    let mealInfo
                                    if (users[0].id != null) {
                                        mealInfo = {
                                            ...meal,
                                            participants: users,
                                        }
                                    } else {
                                        mealInfo = { ...meal }
                                    }
                                    fullMeals.push(mealInfo)
                                    run++
                                    if (run == length) {
                                        res.status(200).json({
                                            Status: 200,
                                            Results: fullMeals,
                                        })
                                    }
                                }
                            )
                        })
                    } else {
                        status.noEndpoint(req, res)
                    }
                }
            )
        })
    },
    //GET
    getMealById(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return status.databaseError(req, res, err.message)
            connection.query(
                `SELECT * FROM meal WHERE meal.id = ${req.params.mealId};`,
                function (error, meal, fields) {
                    if (meal.length > 0) {
                        let query = `SELECT user.id, firstName, lastName, emailAdress, password, phoneNumber, roles, street, city FROM user RIGHT JOIN meal_participants_user ON user.id = meal_participants_user.userId RIGHT JOIN meal ON meal_participants_user.mealId = meal.id WHERE meal.id = ${req.params.mealId}`
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
                                return status.returnList(
                                    req,
                                    res,
                                    fullMeal,
                                    200
                                )
                            }
                        )
                    } else {
                        return status.noEndpoint(req, res)
                    }
                }
            )
        })
    },
    //POST
    createMeal(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return status.databaseError(req, res, err.message)
            let body = req.body
            let query =
                'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES ?'
            var values = [
                [
                    body.id,
                    body.name,
                    body.description,
                    body.imageUrl,
                    body.dateTime,
                    body.maxAmountOfParticipants,
                    body.price,
                    body.cookId,
                ],
            ]
            connection.query(
                query,
                [values],
                function (error, results, fields) {
                    if (error) {
                        return status.databaseError(req, res, error)
                    }
                    connection.release()
                    if (results.affectedRows > 0) {
                        return status.returnOne(req, res, req.body, 201)
                    }
                }
            )
        })
    },
    //PUT
    changeMeal(req, res, next) {
        database.getConnection(function (err, connection) {
            if (err) return status.databaseError(req, res, err)
            let body = req.body

            var query = `UPDATE meal SET name = '${body.name}', description = '${body.description}', isActive = '${body.isActive}', isVegan = '${body.isVegan}', isToTakeHome = '${body.isToTakeHome}', dateTime = '${body.dateTime}', imageUrl = '${body.imageUrl}', allergenes = '${body.allergenes}', maxAmountOfParticipants = '${body.maxAmountOfParticipants}', price = '${body.price}' WHERE id = ${req.params.mealId}`

            connection.query(query, function (error, results, fields) {
                if (error)
                    return status.databaseError(req, res, error.sqlMessage)
                connection.release()
                if (results.changedRows > 0) {
                    next()
                } else {
                    return status.mealNotFound(req, res, 400)
                }
            })
        })
    },
    //DELETE
    deleteMeal(req, res) {
        database.getConnection(function (err, connection) {
            if (err) return status.databaseError(req, res, err)

            let query = `DELETE FROM meal WHERE id = ${req.params.mealId}`

            connection.query(query, function (error, results, fields) {
                if (error)
                    return status.databaseError(req, res, error.sqlMessage)
                connection.release()
                if (results.affectedRows > 0) {
                    return status.returnDelete(req, res)
                } else {
                    return status.mealNotFound(req, res, 400)
                }
            })
        })
    },
    joinMeal(req, res) {},
}

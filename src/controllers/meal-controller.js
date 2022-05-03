const database = require('../database/databaseConnection')
const name = 'Meal controller: '
module.exports = {
    getAllMeals(req, res) {
        let fullMeals = []
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })
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
    getMealById(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })
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
                                res.status(200).json({
                                    Status: 200,
                                    Results: fullMeal,
                                })
                            }
                        )
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
    //POST
    createMeal(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })
            let body = req.body
            let allerg = ''
            body.allergenes.forEach((aller) => {
                allerg = allerg + aller
            })
            let query = `INSERT INTO meal (name, description, isActive, isVega, isVegan, isToTakeHome, dateTime, imageUrl, allergenes, maxAmountOfParticipants, price) VALUES ?`
            var values = [
                [
                    body.name,
                    body.description,
                    body.isActive,
                    body.isVega,
                    body.isVegan,
                    body.isToTakeHome,
                    body.dateTime,
                    body.imageUrl,
                    allerg,
                    body.maxAmountOfParticipants,
                    body.price,
                ],
            ]
            connection.query(
                query,
                [values],
                function (error, results, fields) {
                    if (error)
                        return res.status(400).json({
                            Status: 400,
                            Error: `Your body is Invalid: ${error.sqlMessage}`,
                        })
                    connection.release()
                    if (results.affectedRows > 0) {
                        return res.status(200).json({
                            Status: 200,
                            result: 'Succesfully created meal!',
                        })
                    } else {
                        //Never happens due to assert tests
                        res.status(400).json({
                            Status: 400,
                            Error: 'Could not create meal!',
                            body: req.body,
                        })
                    }
                }
            )
        })
    },
    //PUT
    changeMeal(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })
            let body = req.body

            var query = `UPDATE meal SET name = '${body.name}', description = '${body.description}', isActive = '${body.isActive}', isVegan = '${body.isVegan}', isToTakeHome = '${body.isToTakeHome}', dateTime = '${body.dateTime}', imageUrl = '${body.imageUrl}', allergenes = '${body.allergenes}', maxAmountOfParticipants = '${body.maxAmountOfParticipants}', price = '${body.price}' WHERE id = ${req.params.mealId}`

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
                        results: `Succesfully updated meal ${req.params.mealId}`,
                    })
                } else {
                    res.status(400).json({
                        Status: 400,
                        results: `No meal found with id: ${req.params.mealId}`,
                    })
                }
            })
        })
    },
    //DELETE
    deleteMeal(req, res) {
        database.getConnection(function (err, connection) {
            if (err)
                return res.status(400).json({
                    Status: 400,
                    Error: err,
                })

            let query = `DELETE FROM meal WHERE id = ${req.params.mealId}`

            connection.query(query, function (error, results, fields) {
                if (error)
                    return res.status(400).json({
                        Status: 400,
                        Error: error.sqlMessage,
                    })
                connection.release()
                if (results.affectedRows > 0) {
                    return res.status(200).json({
                        Status: 200,
                        results: `Succesfully deleted meal ${req.params.mealId}`,
                    })
                } else {
                    res.status(400).json({
                        Status: 400,
                        results: `No meal found with id: ${req.params.mealId}!`,
                    })
                }
            })
        })
    },
    joinMeal(req, res) {},
}

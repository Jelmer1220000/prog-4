const express = require('express')
const validator = require('../controllers/validator')
const mealcontroller = require('../controllers/meal-controller')
const router = express.Router()

router.get('/meal', mealcontroller.getAllMeals)
router.get('/meal/:mealId', mealcontroller.getMealById)
router.get('meal/:mealId/participate', mealcontroller.joinMeal)

router.put('/meal/:mealId', validator.validateMeal, mealcontroller.changeMeal)

router.post('/meal', validator.validateMeal, mealcontroller.createMeal)

router.delete('/meal/:mealId', mealcontroller.deleteMeal)

module.exports = router
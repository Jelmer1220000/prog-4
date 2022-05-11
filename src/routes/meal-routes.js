const express = require('express')
const validator = require('../controllers/validator')
const mealcontroller = require('../controllers/meal-controller')
const router = express.Router()

router.get('', mealcontroller.getAllMeals)
router.get('/:mealId', mealcontroller.getMealById)
router.get('/:mealId/participate', mealcontroller.joinMeal)

router.put('/:mealId', validator.validateMeal, mealcontroller.changeMeal, mealcontroller.getMealById)

router.post('', validator.validateMeal, mealcontroller.createMeal)

router.delete('/:mealId', mealcontroller.deleteMeal)

module.exports = router

const express = require('express')
const validator = require('../controllers/validator')
const mealcontroller = require('../controllers/meal-controller')
const auth = require('../controllers/auth-controller')
const authController = require('../controllers/auth-controller')
const mealController = require('../controllers/meal-controller')
const router = express.Router()

router.get('', mealcontroller.getAllMeals)
router.get('/:mealId', mealcontroller.getMealById)

router.put('/:mealId', auth.validateToken, validator.validateMeal, validator.validateOwnerMeal, mealcontroller.changeMeal, mealcontroller.getMealById)

router.post('', auth.validateToken, validator.validateMeal, mealcontroller.createMeal)

router.delete('/:mealId', auth.validateToken, validator.validateOwnerMeal, mealcontroller.deleteMeal)

router.get('/:mealId/participate', auth.validateToken, mealcontroller.partcipate)

// router.delete('/cleanup/:cookId', mealController.clearDB)

module.exports = router

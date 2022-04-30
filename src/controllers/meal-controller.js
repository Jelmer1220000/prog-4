let database = require('../../data/meals');
const name = "Meal controller: ";
module.exports = {

    getAllMeals(req, res) {
    database.sort((a, b) => a.id - b.id)
    database.forEach((item) => {
      let number = database.indexOf(item)
      item.id = number + 1;
     })
    res.status(200).json({
      Status: 200,
      message: 'Succesfully retrieved all meals',
      hint: 'Meals get sorted on ID, new Melas are on bottom',
      mealList: database
    })
    },

    getMealById(req, res) {
        //Filter on requested id
        let item = database.filter((item) => item.id == req.params.mealId);
            if (item.length > 0){
            console.log('Found')
            res.status(201).json({
              Status: 201,
              message: 'Found Meal!',
              user: item[0]
            })
          } else {
            res.status(400).json({
              Status: 400,
              message: `No meal found with id: ${req.params.mealId}`
            })
        }
    },
    updateMeal(req, res) {

    },
    deleteMeal(req, res) {

    },

    createMeal(req, res) {

    },

    joinMeal(req, res) {

    }
    
}
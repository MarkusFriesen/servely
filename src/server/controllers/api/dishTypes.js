  let Models = require('../../models'),
    ObjectId = require('mongoose').Types.ObjectId

module.exports = {
  getDishTypes(req, res) {
    Models.DishTypes.find({}, (err, types) => {
      if (err) {
        console.warn(err)
        res.status(500).json({error: err})
      }
      if (types.length) {
        res.json(types)
      } else {
        res.json([])
      }
    })
  },
  addDishType(req, res) {
    Models.DishTypes.create(
      {
        name: req.body.name
      }, (err, type) => {
      if (err) {
        console.warn(err)
        res.status(500).json({error: err})
      } else {
        res.status(200).json(type)
      }
    })
  },
  updateDishType(req, res){
    Models.DishTypes.findOneAndUpdate({ "_id": req.body.id }, {$set: {
        name: req.body.name
    }}, {new: true}, (err, type) => {
      if (err) {
        console.warn(err)
        res.status(500).json({error: err})
      } else {
        res.status(200).json(type)
      }
    })
  },
  deleteDishType(req, res){
    Models.DishTypes.remove({ "_id" : req.body.id }, (err, type) => {
      if (err){
        console.error(err)
        res.status(500).json({error: err})
      } else {
          res.status(200).json(type)
      }
    })
  },
}

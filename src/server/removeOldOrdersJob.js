let cron = require('node-cron'),
    Models = require('./data/Models')
 
cron.schedule("* */2 * * *", function(){
  const date = new Date()
  date.setDate(date.getDate() - 120)
  Models.Orders.deleteMany({ "timestamp" : { $lt : date}, "hasPayed": true }, (err, order) => {
      if (err){
        console.error(err)
      }
      console.info("Deleted orders:", order.deletedCount)
    })
});
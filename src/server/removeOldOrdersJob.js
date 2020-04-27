import cron from 'node-cron'
import config from './config'

const startCronjob = (db) => {
  cron.schedule("* */2 * * *", async () => {
    
    const newestOrder = await db.get(config.tables.orders).maxBy( o => o.timestamp).value()
    let date = new Date(newestOrder.timestamp)
    date.setDate(date.getDate() - 240)
    date = date.toISOString()

    console.info("Deleting everything before: ", date)

    const deletedItems = await db.get(config.tables.orders).remove(o =>  o.timestamp < date && o.hasPayed ).write()

    console.info("Deleted orders:", deletedItems.length)
  });
}

export {
   startCronjob
  }

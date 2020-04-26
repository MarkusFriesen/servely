import cron from 'node-cron'
import config from './config'

const startCronjob = (db) => {
  cron.schedule("* */2 * * *", async () => {
    const date = new Date()
    date.setDate(date.getDate() - 240)

    const deletedItems = await db.get(config.tables.orders).remove(o =>  o.timestamp < date && o.hasPayed ).write()

    console.info("Deleted orders:", deletedItems.length)
  });
}

export {
   startCronjob
  }

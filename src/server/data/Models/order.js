import { generateUUID } from '../../utils/helpers'

const createOrder = (item) => ({
  _id: generateUUID(),
  table: item.table,
  name: item.name,
  notes: item.notes,
  timestamp: item.timestamp ? new Date(item.timestamp).toISOString() : new Date().toISOString(),
  hasPayed: item.hasPayed || false,
  amountPayed: item.amountPayed || 0,
  dishes: (item.dishes || []).map(d => ({
    id: d.id, 
    made: d.made || false, 
    delivered: d.delivered || false,
    hasPayed: d.hasPayed || false,
    extras: d.extras || []
  })) 
})

export {
  createOrder
}
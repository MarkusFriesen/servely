import { generateUUID } from '../../utils/helpers'

const getOrder = (item) => ({
  _id: generateUUID(),
  table: item.table,
  name: item.name,
  notes: item.notes,
  timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
  hasPayed: result.hasPayed || false,
  amountPayed: item.amountPayed || 0,
  dishes: (result.dishes || []).map(d => ({
    id: d.id, 
    made: d.made || false, 
    delivered: d.delivered || false,
    hasPayed: d.hasPayed || false,
    extras: d.extras
  })) 
})

export {
  getOrder
}
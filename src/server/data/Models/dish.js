import {generateUUID} from '../../utils/helpers'

const createDish = (item) => ({
  _id: generateUUID(),
  name: item.name, 
  cost: item.cost, 
  type: item.type,
  description: item.description, 
  deselectedExtras: item.deselectedExtras
})

export {
  createDish
}
import {generateUUID} from '../../utils/helpers'

const createDishExtra = (item) => ({
  _id: generateUUID(),
  name: item.name,
  cost: item.cost,
  type: item.type
})
export {createDishExtra}
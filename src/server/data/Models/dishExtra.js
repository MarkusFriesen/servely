import {generateUUID} from '../../utils/helpers'

const getDishExtra = (item) => ({
  _id: generateUUID(),
  name: item.name,
  cost: item.cost,
  type: item.type
})
export {getDishExtra}
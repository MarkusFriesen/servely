import {generateUUID} from '../../utils/helpers'

const createDishType = (item) => ({
  _id: generateUUID(),
  name: item.name
})
export { createDishType }
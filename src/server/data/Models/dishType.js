import {generateUUID} from '../../utils/helpers'

const getDishType = (item) => ({
  _id: generateUUID(),
  name: item.name
})
export { getDishType }
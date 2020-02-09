import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type DishType {
  _id: ID
  name: String!
}
type Dish {
  _id: ID
  name: String!
  cost: Float!
  type: DishType!
  deselectedExtras: [DishExtra]
}
type DishExtra {
  _id: ID
  name: String!
  cost: Float!
  type: DishType!
}
type OrderDish {
  dish: Dish!
  made: Boolean
  delivered: Boolean
  hasPayed: Boolean
  extras: [DishExtra]
}
type Order {
  _id: ID
  table: Int!
  name: String
  timestamp: String!
  dishes: [OrderDish]
  amountPayed: Float
  notes: String
}
type Company {
  name: String!, 
  street: String!, 
  postalCode: String!,
  city: String!,
  website: String, 
  taxId: String
}
type Query {
  orders(_id:ID, table: Int, name: String, hasPayed: Boolean): [Order]
  dishes(_id:ID, name:String): [Dish]
  dishTypes(_id:ID, name:String): [DishType]
  dishExtras(_id:ID, name:String, cost:Float, type: ID): [DishExtra]
  company: Company
}
input orderDishMutation {
  id: ID!
  made: Boolean
  hasPayed: Boolean
  delivered: Boolean
  extras: [ID]
}
type Mutation {
  addOrder(table: Int!, name:String, dishes: [orderDishMutation]!, notes: String): Order
  updateOrder(_id: ID!, name: String, table: Int, dishes: [orderDishMutation], notes: String, amountPayed: Float): Order
  joinOrders(_id: ID!, orderIds: [ID]!) : Order
  addDish(name: String!, cost: Float!, type: ID!, deselectedExtras: [ID] ): Dish
  updateDish(_id: ID!, name:String, cost: Float, type: ID, deselectedExtras: [ID]): Dish
  removeDish(_id: ID!) : Dish
  addDishType(name: String!): DishType
  updateDishType(_id: ID!, name: String!): DishType
  removeDishType(_id: ID!): DishType
  addDishExtra(name: String!, cost: Float!, type: ID!): DishExtra
  updateDishExtra(_id: ID!, name: String!, cost: Float!, type: ID!): DishExtra
  removeDishExtra(_id: ID!): DishExtra
}
schema {
  query: Query
  mutation: Mutation
}
`;

export default makeExecutableSchema({ typeDefs, resolvers });
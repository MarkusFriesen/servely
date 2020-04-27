const config = {
  GRAPHQL_PORT: 8080,
  LOWDB_PATH: '/data/orders.json', 
  COMPANY: {
    name: 'REACH CAFÉ',
    street: 'Marktplatz 18/1',
    postalCode: '78647',
    city: 'Trossingen',
    website: 'www.reach-cafe.com',
    taxId: ''
  },
  tables: {
    orders: 'orders',
    dishes: 'dishes',
    dishTypes: 'dishTypes',
    dishExtras: 'dishExtras'
  }
}
export default config;
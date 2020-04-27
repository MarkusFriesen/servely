import assert from 'assert';
import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import {getResolvers} from '../data/resolvers';
import regeneratorRuntime from "regenerator-runtime";

const adapter = new FileAsync('src/server/tests/data/testDb.json')

let db = {}
let resolvers = getResolvers(db)

before(async () => {
  db = await low(adapter)

  await db.defaults({orders: [], dishes: [], dishExtras: [], dishTypes: []}).write()
  resolvers = getResolvers(db)
});

describe('Resolvers', function () {
  beforeEach(async () => {
    db.setState({orders: [], dishes: [], dishExtras: [], dishTypes: []})
  })

  describe('DishType', function () {
    it('should be creatable', async function () {
      //set up
      let items = resolvers.Query.dishTypes(null, {})
      assert.equal(items.length, 0)

      //act
      const typeName = "RandomDishType"
      await resolvers.Mutation.addDishType(null, {name: typeName})

      //verify
      items = await resolvers.Query.dishTypes(null, {})
      assert.equal(items.length, 1)
      assert.equal(items[0].name, typeName)
    });
    it('should be updatable', async function () {
      //setup
      const itemName = "name before"
      const item = await resolvers.Mutation.addDishType(null, {name: itemName})

      let items = await resolvers.Query.dishTypes(null, {_id: item._id})

      assert.equal(items.length, 1)
      assert.equal(items[0].name, itemName)

      //act
      const itemNameAfter = "name after"
      const newItem = await resolvers.Mutation.updateDishType(null, {_id: item._id, name: itemNameAfter})
      assert.equal(newItem._id, item._id)

      //verify
      items = await resolvers.Query.dishTypes(null, {_id: item._id})
      assert.equal(items.length, 1)
      assert.equal(items[0].name, itemNameAfter)

    });
    it('should be deletable', async function () {
      //set up
      const typeName = "RandomDishType"
      var item = await resolvers.Mutation.addDishType(null, {name: typeName})

      let items = await resolvers.Query.dishTypes(null, {_id: item._id})
      assert.equal(items.length, 1)

      //act
      const deletedItem = await resolvers.Mutation.removeDishType(null, {_id: item._id})
      assert.equal(deletedItem.length, 1)
      assert.equal(deletedItem[0]._id, item._id)

      //verify
      items = await resolvers.Query.dishTypes(null, {_id: item._id})
      assert.equal(items.length, 0)
    });
    it('shouldn\'t be deleted if a dish exists', async function () {
      //set up
      const typeName = "RandomDishType"
      const item = await resolvers.Mutation.addDishType(null, {name: typeName})
      const dishName = "RandomDish"
      await resolvers.Mutation.addDish(null, {name: dishName, type: item._id})

      let items = await resolvers.Query.dishTypes(null, {_id: item._id})
      assert.equal(items.length, 1)

      //act
      await assert.rejects(async () => await resolvers.Mutation.removeDishType(null, {_id: item._id}), (err) => {
        //verify
        assert.equal(err, "Some dishes with this dish type still exist. Remove those dishes first, before removing the dish type.")
        return true
      })
    });
  });
  describe('Dish', function () {
    it('should be creatable', async () => {
      //set up
      const dish = {
        name: "random name",
        cost: 5.0,
        type: "123",
        deselectedExtras: ["234"]
      }

      //act
      const newDish = await resolvers.Mutation.addDish(null, dish)

      //verify
      //todo: Verify that the type and delselected exist
      const items = await resolvers.Query.dishes(null, {_id: newDish._id})
      assert.equal(1, items.length)
      assert.equal(dish.name, items[0].name)
      assert.equal(dish.cost, items[0].cost)
      assert.equal(dish.type, items[0].type)
      assert.equal(dish.deselectedExtras, items[0].deselectedExtras)
    });

    it('should be updatable', async () => {
      //set up
      const dish = {
        name: "random name",
        cost: 5.0,
        type: "123",
        deselectedExtras: ["234"]
      }
      const createdDish = {...await resolvers.Mutation.addDish(null, dish)}

      //act
      const newDish = {
        _id: createdDish._id,
        name: "newName",
        cost: 10.0,
        type: "456",
        deselectedExtras: ["456"]
      }
      const updatedDish = await resolvers.Mutation.updateDish(null, newDish)

      //Verify
      assert.equal(createdDish._id, updatedDish._id)
      assert.notEqual(createdDish.name, updatedDish.name)
      assert.notEqual(createdDish.cost, updatedDish.cost)
      assert.notEqual(createdDish.type, updatedDish.type)
      assert.notEqual(createdDish.deselectedExtras, updatedDish.deselectedExtras)

      const items = await resolvers.Query.dishes(null, {_id: newDish._id})
      assert.equal(items.length, 1)
      assert.equal(items[0].name, newDish.name)
      assert.equal(items[0].cost, newDish.cost)
      assert.equal(items[0].type, newDish.type)
      assert.equal(items[0].deselectedExtras, newDish.deselectedExtras)
    });

    it('should be deletable', async () => {
      //set up 
      const dish = {
        name: "random name"
      }
      var item = await resolvers.Mutation.addDish(null, dish)

      let items = await resolvers.Query.dishes(null, {_id: item._id})
      assert.equal(items.length, 1)

      //act
      const deletedItem = await resolvers.Mutation.removeDish(null, {_id: item._id})
      assert.equal(deletedItem.length, 1)
      assert.equal(deletedItem[0]._id, item._id)

      //verify
      items = await resolvers.Query.dishes(null, {_id: item._id})
      assert.equal(items.length, 0)
    });

    it('should delete the dishes from existing orders if dish is deleted', async () => {
      //set up      
      var dish = await resolvers.Mutation.addDish(null, {name: "random name"})
      var order = await resolvers.Mutation.addOrder(null, {dishes: [{id: dish._id}]})

      //act
      const deletedDish = await resolvers.Mutation.removeDish(null, {_id: dish._id})

      //verify
      assert.equal(deletedDish.length, 1)
      assert.equal(deletedDish[0]._id, dish._id)

      const allOrders = await resolvers.Query.orders(null, {_id: order._id})
      assert.equal(allOrders.length, 1)
      assert.equal(allOrders[0].dishes.length, 0)
    });
  });
  describe('DishExtra', function () {
    it('should be creatable', async () => {
      //set up
      const extra = {
        name: "random name",
        const: 5.0,
        type: "123",
      }

      //act
      const newExtra = await resolvers.Mutation.addDishExtra(null, extra)

      //verify
      //todo: Verify that the type exist
      const items = await resolvers.Query.dishExtras(null, {_id: newExtra._id})
      assert.equal(1, items.length)
      assert.equal(items[0].name, newExtra.name)
      assert.equal(items[0].cost, newExtra.cost)
      assert.equal(items[0].type, newExtra.type)
    });
    it('should be updatable', async () => {
      //set up
      const extra = {
        name: "random name",
        const: 5.0,
        type: "123",
      }
      const createdExtra = {...await resolvers.Mutation.addDishExtra(null, extra)}

      //act
      const newExtra = {
        _id: createdExtra._id,
        name: "new Extra",
        cost: 10.0,
        type: "456"
      }
      const updatedExtra = await resolvers.Mutation.updateDishExtra(null, newExtra)

      //Verify
      assert.equal(updatedExtra._id, createdExtra._id)
      assert.notEqual(updatedExtra.name, createdExtra.name)
      assert.notEqual(updatedExtra.cost, createdExtra.cost)
      assert.notEqual(updatedExtra.type, createdExtra.type)

      const items = await resolvers.Query.dishExtras(null, {_id: newExtra._id})
      assert.equal(items.length, 1)
      assert.equal(items[0].name, newExtra.name)
      assert.equal(items[0].cost, newExtra.cost)
      assert.equal(items[0].type, newExtra.type)
    });
    it('should be deletable', async () => {
      //set up 
      const extra = {
        name: "extra to be deleted"
      }
      var item = await resolvers.Mutation.addDishExtra(null, extra)

      let items = await resolvers.Query.dishExtras(null, {_id: item._id})
      assert.equal(items.length, 1)

      //act
      const deletedItem = await resolvers.Mutation.removeDishExtra(null, {_id: item._id})
      assert.equal(deletedItem.length, 1)
      assert.equal(deletedItem[0]._id, item._id)

      //verify
      items = await resolvers.Query.dishExtras(null, {_id: item._id})
      assert.equal(items.length, 0)
    });
    it('should delete all extras from orders and when delete', async () => {
      //set up 
      var dish = await resolvers.Mutation.addDish(null, {name: "dishWithExtra"})
      var extra = await resolvers.Mutation.addDishExtra(null, {name: "extra for dish", type: dish._id})
      var order = await resolvers.Mutation.addOrder(null, {name: "extra for dish", dishes: [{id: dish._id, extras: [extra._id]}]})

      //act
      const deletedExtra = await resolvers.Mutation.removeDishExtra(null, {_id: extra._id})
      assert.equal(deletedExtra.length, 1)
      assert.equal(deletedExtra[0]._id, extra._id)

      //verify
      const items = await resolvers.Query.orders(null, {_id: order._id})
      assert.equal(items.length, 1)
      assert.equal(items[0].dishes.length, 1)
      assert.equal(items[0].dishes[0].extras.length, 0)

    });
  });
  describe('Order', function () {
    beforeEach(async () => {
      await db.setState({orders: [], dishes: [], dishExtras: [], dishTypes: []})
    })
    it('should be creatable', async () => {
      //set up
      const order = {
        name: "random person",
        table: 5.0,
        notes: "",
        timestamp: new Date().toISOString(),
        dishes: [{
          id: "123"
        }]
      }

      //act
      const newOrder = await resolvers.Mutation.addOrder(null, order)

      //verify
      //todo: Verify that the type exist
      const items = await resolvers.Query.orders(null, {_id: newOrder._id})
      assert.equal(1, items.length)
      assert.equal(items[0].name, newOrder.name)
      assert.equal(items[0].table, newOrder.table)
      assert.equal(items[0].nates, newOrder.nates)
      assert.equal(items[0].timestamp, newOrder.timestamp)
      assert.equal(items[0].hasPayed, false)
      assert.equal(items[0].amountPayed, 0)
      assert.equal(items[0].dishes.length, 1)
      assert.equal(items[0].dishes[0].id, newOrder.dishes[0].id)
    });
    it('should be updatable', async () => {
      //set up
      const order = {
        name: "random person",
        table: 5.0,
        notes: "",
        timestamp: new Date().toISOString(),
        dishes: [{
          id: "123"
        }]
      }

      const newOrder = {...await resolvers.Mutation.addOrder(null, order)}

      //act
      const exptedUpdatedOrder = {
        _id: newOrder._id,
        name: "editedPerson",
        table: 10.0,
        notes: "This is a note",
        timestamp: new Date(0).toISOString(),
        dishes: [{
          id: "123"
        },
        {
          id: "456"
        }]
      }
      const updatedOrder = {...await resolvers.Mutation.updateOrder(null, exptedUpdatedOrder)}
      assert.equal(updatedOrder._id, newOrder._id)

      //verify
      //todo: Verify that the type exist
      const items = await resolvers.Query.orders(null, {_id: newOrder._id})
      assert.equal(1, items.length)
      assert.equal(items[0].name, exptedUpdatedOrder.name)
      assert.equal(items[0].table, exptedUpdatedOrder.table)
      assert.equal(items[0].nates, exptedUpdatedOrder.nates)
      assert.equal(items[0].timestamp, exptedUpdatedOrder.timestamp)
      assert.equal(items[0].hasPayed, false)
      assert.equal(items[0].dishes.length, 2)
      assert.equal(items[0].dishes[0].id, exptedUpdatedOrder.dishes[0].id)
      assert.equal(items[0].dishes[1].id, exptedUpdatedOrder.dishes[1].id)
    });
    it('should accumulated amountPayed when updated', async () => {
      //set up
      const orignialOrder = {amountPayed: 10.0}
      const newOrder = {...await resolvers.Mutation.addOrder(null, orignialOrder)}

      //act
      const exptedUpdatedOrder = {
        _id: newOrder._id,
        amountPayed: 15.0
      }
      const updatedOrder = await resolvers.Mutation.updateOrder(null, exptedUpdatedOrder)
      assert.equal(updatedOrder._id, newOrder._id)

      //verify
      //todo: Verify that the type exist
      const items = await resolvers.Query.orders(null, {_id: newOrder._id})
      assert.equal(1, items.length)
      assert.equal(items[0].amountPayed, exptedUpdatedOrder.amountPayed + orignialOrder.amountPayed)
    });
    it('should set hasPayed correctly when updated', async () => {
      //setup
      const orignialOrder = {
        name: "markus",
        table: 5.0,
        notes: "with extra love",
        dishes: [{
          id: "124",
          hasPayed: false
        }, {
          id: "456",
          hasPayed: true
        }]
      }
      const newOrder = {...await resolvers.Mutation.addOrder(null, orignialOrder)}

      //act
      const exptedUpdatedOrder = {
        _id: newOrder._id,
        dishes: [{
          id: "124",
          hasPayed: true
        }, {
          id: "456",
          hasPayed: true
        }]
      }
      await resolvers.Mutation.updateOrder(null, exptedUpdatedOrder)

      //verify
      const items = await resolvers.Query.orders(null, {_id: newOrder._id})
      assert.equal(1, items.length)
      assert.equal(items[0].name, orignialOrder.name)
      assert.equal(items[0].table, orignialOrder.table)
      assert.equal(items[0].notes, orignialOrder.notes)
      assert.equal(items[0].hasPayed, true)
    });
    it('should be joinable', async () => {
      //set up
      const order1 = {
        table: 1.0,
        name: "Joined Order 1",
        dishes: [
          {
            id: "123",
            made: false,
            delivered: true
          }
        ]
      }
      const order2 = {
        table: 2.0,
        name: "Joined Order 2",
        dishes: [
          {
            id: "123"
          },
          {
            id: "456",
          }
        ]
      }

      const createdOrder1 = {...await resolvers.Mutation.addOrder(null, order1)}
      const createdOrder2 = {...await resolvers.Mutation.addOrder(null, order2)}

      //act
      const result = await resolvers.Mutation.joinOrders(null, {
        _id: createdOrder1._id,
        orderIds: [createdOrder2._id]
      })

      assert.equal(result._id, createdOrder1._id)
      assert.equal(result.name, order1.name)
      assert.equal(result.table, order1.table)

      //verify 
      let items = await resolvers.Query.orders(null, {_id: createdOrder2._id})
      assert.equal(items.length, 0)
      items = await resolvers.Query.orders(null, {_id: createdOrder1._id})
      assert.equal(items[0].name, order1.name)
      assert.equal(items[0].table, order1.table)
      assert.equal(items[0].dishes.length, 3)
      assert.equal(items[0].dishes[0].id, order1.dishes[0].id)
      assert.equal(items[0].dishes[0].made, order1.dishes[0].made)
      assert.equal(items[0].dishes[0].delivered, order1.dishes[0].delivered)
      assert.equal(items[0].dishes[1].id, order2.dishes[0].id)
      assert.equal(items[0].dishes[1].made, false)
      assert.equal(items[0].dishes[1].delivered, false)
      assert.equal(items[0].dishes[2].id, order2.dishes[1].id)
    });

    describe('Query', function () {
      it('should return only orders in range', async () => {
        //set up
        const order1 = {
          table: 1.0,
          name: "Joined Order 1",
          timestamp: new Date("2020-01-01").toISOString()
        }
        const order2 = {
          table: 2.0,
          name: "Joined Order 2",
          timestamp: new Date("2019-01-01").toISOString()
        }
        const order3 = {
          table: 3.0,
          name: "Joined Order 3",
          timestamp: new Date("2018-01-01").toISOString()
        }

        const createdOrder1 = {...await resolvers.Mutation.addOrder(null, order1)}
        const createdOrder2 = {...await resolvers.Mutation.addOrder(null, order2)}
        const createdOrder3 = {...await resolvers.Mutation.addOrder(null, order3)}

        //act
        const withFrom = await resolvers.Query.orders(null, {
          fromTimestamp: new Date("2019-05-05").toISOString()
        })

        const withTo = await resolvers.Query.orders(null, {
          toTimestamp: new Date("2018-05-05").toISOString()
        })

        const withBoth = await resolvers.Query.orders(null, {
          fromTimestamp: new Date("2018-05-05").toISOString(),
          toTimestamp: new Date("2019-05-05").toISOString()
        })

        //Verify
        assert.equal(withFrom.length, 1)
        assert.equal(withTo.length, 1)
        assert.equal(withBoth.length, 1)

        assert.equal(withFrom[0]._id, createdOrder1._id)
        assert.equal(withTo[0]._id, createdOrder3._id)
        assert.equal(withBoth[0]._id, createdOrder2._id)
      });
    });
  });

});
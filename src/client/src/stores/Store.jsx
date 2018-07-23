import { observable, decorate } from "mobx"

class Store {
  searchText = ""
  kitchenMode = false
}

decorate(Store, {
  searchText: observable,
  kitchenMode: observable
})

let DefaultStore = new Store()

export default DefaultStore
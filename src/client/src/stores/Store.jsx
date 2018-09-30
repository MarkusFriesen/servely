import { observable, decorate } from "mobx"

class Store {
  searchText = ""
  kitchenMode = localStorage.getItem("Bit.KitchenMode") || false

  setKitchenMode(isOn){
    this.kitchenMode = isOn;
    localStorage.setItem("Bit.KitchenMode", isOn);
  }
}

decorate(Store, {
  searchText: observable,
  kitchenMode: observable
})

let DefaultStore = new Store()

export default DefaultStore
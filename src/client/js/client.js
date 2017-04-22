import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { Provider } from "mobx-react"

import Orders from "./pages/Orders";
import Dishes from "./pages/Dishes";
import Layout from "./pages/Layout";
import Settings from "./pages/Settings";

import OrderStore from "./stores/OrderStore"
import DishStore from "./stores/DishStore"
import DishTypeStore from "./stores/DishTypeStore"

const app = document.getElementById('app');
const stores = {
  orderStore: OrderStore,
  dishStore: DishStore,
  dishTypeStore: DishTypeStore
}
ReactDOM.render(
    <Provider {...stores}>
      <Router history={hashHistory}>
        <Route path="/" component={Layout}>
          <IndexRoute component={Orders}></IndexRoute>
          <Route path="Orders" name="Orders" component={Orders}>Orders</Route>
          <Route path="Dishes" name="Dishes" component={Dishes}>Dishes</Route>
          <Route path="Settings" name="Settings" component={Settings}>Settings</Route>
        </Route>
      </Router>
    </Provider>,
app);

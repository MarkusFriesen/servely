import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react"
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Layout, Content } from 'react-mdl';

import Orders from "./pages/Orders";
import Dishes from "./pages/Dishes";
import Settings from "./pages/Settings";

import OrderDetails from "./pages/OrderDetails";
import DishDetails from "./pages/DishDetails";
import DishTypeSettings from "./pages/DishTypeSettings";
import SplitOrder from "./pages/SplitOrder";
import PayOrder from "./pages/PayOrder";
import JoinOrder from "./pages/JoinOrder";

import Nav from "./components/layout/Nav";
import Drawer from "./components/layout/Drawer";

import OrderStore from "./stores/OrderStore";
import DishStore from "./stores/DishStore";
import DishTypeStore from "./stores/DishTypeStore"

import css from '../styles/app.scss'

const app = document.getElementById('app')
const stores = {
  orderStore: OrderStore,
  dishStore: DishStore,
  dishTypeStore: DishTypeStore
}


ReactDOM.render(
  <Provider  { ...stores }>
    <Router >
      <Layout fixedHeader>
        <Nav />
        <Drawer />

        <Content>
          <Route exact path="/" component={ Orders }/>
          <Route path="/orders" component={ Orders }/>
          <Route path="/payOrder/:id?" component={ PayOrder }/>
          <Route path="/splitOrder/:id?" component={ SplitOrder }/>
          <Route path="/joinOrder/:id?" component={ JoinOrder }/>
          <Route path="/dishes" component={ Dishes }/>
          <Route path="/settings" component={ Settings }/>
          <Route path="/orderDetails/:id?" component={ OrderDetails }/>
          <Route path="/dishDetails/:id?" component={ DishDetails }/>
          <Route path="/setting/dishType/:id?" component={ DishTypeSettings }/>
        </Content>
      </Layout>
    </Router>
  </Provider>,
  app);
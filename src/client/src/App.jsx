import React, { Component } from 'react'
import {
  Route
} from 'react-router-dom'

import Orders from "./pages/Orders"
import OrderDetails from "./pages/OrderDetails"
import Nav from './components/Navigation/Nav'
import PayOrder from './pages/PayOrder'
import Settings from './pages/Settings'
import Dishes from './pages/Dishes'
import Hist from './pages/History'

import './App.css'

class App extends Component {
  render() {
    return (
      <div>
        <Nav />

        <div className="mdc-top-app-bar--fixed-adjust">
          <Route exact path="/" component={ Orders } />
          <Route path="/orders" component={ Orders } />
          <Route path="/orderDetails/:id?" component={OrderDetails} />
          <Route path="/payOrder/:id" component={PayOrder} />
          <Route path="/settings" component={Settings} />
          <Route path="/dishes" component={Dishes} />
          <Route path="/orderHistory" component={Hist} />
        </div>
      </div>
    );
  }
}

export default App;

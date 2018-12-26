import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import './App.css';

import Nav from './components/navigation/Nav'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import PayOrder from './pages/PayOrder'
import Dishes from './pages/Dishes'
import Settings from './pages/Settings'
import Hist from './pages/History'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav />

        
        <div className="mdc-top-app-bar--fixed-adjust">
          <Route exact path="/" component={ Orders } />
          <Route path="/orders" component={ Orders } />
          <Route path="/orderDetails/:id?" component={OrderDetails} />
          <Route path="/payOrder/:id" component={PayOrder} />
          <Route path="/dishes" component={Dishes} />
          <Route path="/settings" component={Settings} />
          <Route path="/orderHistory" component={Hist} />
        </div>
      </div>
    );
  }
}

export default App;

import React from "react";
import { Link } from 'react-router-dom'
import { indexOf } from 'lodash'
import { Drawer, Navigation } from 'react-mdl';

export default class NavDrawer extends React.Component {

  onClick(){
    const layout = document.querySelector('.mdl-layout');
    if (indexOf(layout.MaterialLayout.drawer_.classList, "is-visible") > -1){
      layout.MaterialLayout.toggleDrawer();
    }
  }

  render() {
    
    return (      
      <Drawer title="Menu">
        <Navigation>
          <Link to="/orders" onClick={ this.onClick.bind(this) }>
            <i class="material-icons" role="presentation">shopping_cart</i>Orders
          </Link>
          <Link  to="/orderHistory" onClick={ this.onClick.bind(this) }>
            <i class="material-icons" role="presentation">history</i>History
          </Link>
          <Link to="/dishes" onClick={ this.onClick.bind(this) }>
            <i class="material-icons" role="presentation">shopping_basket</i>Dishes
          </Link>
          <Link  to="/settings" onClick={ this.onClick.bind(this) }>
            <i class="material-icons" role="presentation">settings</i>Settings
          </Link>
        </Navigation>
        
        <div class="mdl-layout-spacer"/>
        <span class="drawer-footer">Made with<i class="material-icons">favorite</i>by Markus </span>
      </Drawer>
    )
  }
}
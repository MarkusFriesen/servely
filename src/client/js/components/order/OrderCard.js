import React from "react";
import { Card, CardTitle, CardText, CardActions, Button, IconButton, Icon, CardMenu } from 'react-mdl';
import { inject, observer } from "mobx-react"
import { Link } from "react-router-dom"

import OrderDishTable from "./OrderDishTable" 
import OrderPayDialog from "./OrderPayDialog"
import JoinOrder from "./JoinOrder"
import SplitOrder from "./SplitOrder"

@inject('orderStore')
@observer
export default class OrderCard extends React.Component {
  constructor(props){
    super (props)

    this.state = {
      expandCard: this.props.orderStore.kitchenMode
    }
  }

  toggleExpand(){
    this.setState({expandCard: !this.state.expandCard})
  }

  render() {
    return (
      <div class="masonry-layout__panel">
        <Card shadow={2}>
          <CardTitle>
            <h4>
              <div class="smaller">Table { this.props.table } </div>
              { this.props.name }
            </h4>
          </CardTitle>
          <CardText>
            <OrderDishTable orderId={this.props._id}/>
          </CardText>
          <CardActions>
            <div>
            <SplitOrder id={ this.props._id } />
            <JoinOrder table={this.props.table} id={this.props._id}/>
              { this.state.expandCard ? 
                <IconButton name="expand_more" onClick={this.toggleExpand.bind(this)}/> :
                <IconButton name="expand_less" onClick={this.toggleExpand.bind(this)}/>
              }
              
            <Link to={`/orderDetails/${this.props._id}`}><IconButton name="mode_edit" /></Link>
            </div>
          </CardActions >
            {
              this.state.expandCard ?
              <CardText> <p>{this.props.notes}</p></CardText>: undefined
            }
          <CardMenu>
            <OrderPayDialog dishes={this.props.dishes} id={this.props._id}/>
          </CardMenu>
        </Card>
      </div>
    )
  }
}
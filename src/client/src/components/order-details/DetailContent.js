import React, { Component } from 'react'
import { Grid, GridCell } from '@rmwc/grid';
import { TabBar, Tab } from '@rmwc/tabs';
import { Chip, ChipSet } from '@rmwc/chip';
import {
  List,
  SimpleListItem
} from '@rmwc/list';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { LinearProgress } from '@rmwc/linear-progress';

import './Details.css'

const AddOrder = gql`
  mutation addOrder($name: String, $table: Int!, $notes: String, $dishes: [orderDishMutation]!){
    addOrder(table: $table, name: $name, dishes: $dishes, notes: $notes){
      _id, 
      name,
      table,
      notes
    }
  }
`;

const UpdateOrder = gql`
  mutation updateOrder($id: ID!, $name: String, $table: Int, $notes: String, $dishes: [orderDishMutation]){
    updateOrder(_id: $id, table: $table, name: $name, dishes: $dishes, notes: $notes ){
      _id, 
      name,
      table,
      notes
    }
  }
`;

export default class DetailContent extends Component {
  constructor(){
    super()

    this.addDish = this.addDish.bind(this)
    this.removeDish = this.removeDish.bind(this)
    this.changeTextField = this.changeTextField.bind(this)
  }


  state = {
    id: "",
    name: "",
    table: 0, 
    notes : "",
    dishes: [],
    activeTabIndex: 0,
    dishTypes: {}
  } 

  componentDidMount(){
    if (this.props.order)
      this.setState({
        id: this.props.order._id,
        name: this.props.order.name,
        table: this.props.order.table,
        notes: this.props.order.notes,
        dishes: this.props.order.dishes.map(d => {return {dish: {id: d.dish._id, name: d.dish.name }, made: d.made, hasPayed: d.hasPayed}})
      })
      
    const dishTypes = this.state.dishTypes
     this.props.dishes.forEach(d => {
      if (dishTypes[d.type.name]){
        dishTypes[d.type.name].push(d)
      } else {
        dishTypes[d.type.name] = [d]
      }
    });

    this.setState({
      dishTypes: dishTypes
    })
  }

  addDish(id, name){
    return () => {
      const dishes = [{ dish: { id, name }, made: false, hasPayed: false }].concat(this.state.dishes)
      this.setState(
        {
          dishes: dishes
        })
    }
  }

  removeDish(e){
    const id = e.target
    let dishes = this.state.dishes

    if (dishes.length < id) return
    if (dishes[id].hasPayed || dishes[id].made) return

    if (dishes.length === 1)
      dishes = []
    else 
      dishes.splice(id, 1)
    this.setState({ dishes: dishes})
  }

  changeTextField(field){
    return (e) =>{
      const state = {}
      state[field] = e.target.value
      this.setState(state)
    }
  }

  render() {
    const keys = Object.keys(this.state.dishTypes)
    const { state, props, removeDish } = this
    return (
      <React.Fragment>
      <Grid className="order-details">
        <GridCell span="12">
          { keys.length === 0 ? String() : 
              <TabBar
                activeTabIndex={state.activeTabIndex}
                onActivate={evt => {
                  this.setState({ 'activeTabIndex': evt.detail.index })
                }}
              >
                {keys.map((v, i) => <Tab key={i}>{v}</Tab>)}
              </TabBar>
          }
            <ChipSet>
              {
                (state.dishTypes[keys[state.activeTabIndex]] || []).sort((a, b) => a.name < b.name ? -1 : 1).map((v, i) =>
                <Chip key={i} onClick={this.addDish(v._id, v.name)} label={v.name} checkmark selected={
                  state.dishes.some(d => d.dish.id === v._id)
                }/>
              )}
            </ChipSet>  

        </GridCell>
      </Grid>
      <Grid className="order-details">
        <GridCell span="6">
          <List onAction={removeDish}>
            {state.dishes.map((v, i) => 
                <SimpleListItem
                  key={i}
                  text={v.dish.name}
                  graphic={v.hasPayed ? "attach_money" : v.made ? "done" : "remove"}
                  ripple={false}
                  activated={false}
                />              
            )}
          </List>
        </GridCell>
        <GridCell span="6">
            <TextField icon="event_seat" label="Table" type="number" min="0" inputMode="numeric" pattern="\d*" value={state.table} onChange={this.changeTextField("table")} />
            <TextField icon="account_circle" label="Name" value={state.name} onChange={this.changeTextField("name")} />
            <TextField textarea fullwidth label="Notes" type="number" value={state.notes} onChange={this.changeTextField("notes")} />
        </GridCell>
      </Grid>
      <Mutation mutation={props.id ? UpdateOrder : AddOrder}>
      {(addOrUpdate, {data, loading, error}) => {
          let result = <Button onClick={() => addOrUpdate({
            variables: {
              id: state.id,
              table: state.table,
              name: state.name,
              notes: state.notes,
              dishes: state.dishes.map(d => { return { id: d.dish.id, made: d.made, hasPayed: d.hasPayed} }).filter(d => d && d.id)
            }
          })} theme="secondary">Save</Button>

          if (loading) 
            result = 
            <React.Fragment>
              <LinearProgress determinate={false}></LinearProgress>
              {result}
            </React.Fragment>
          if (error) console.error(error);

          if (data) props.history.goBack()

          return result
        }}
        </Mutation>
      </React.Fragment>
    )
  }
}
import React, {Component} from 'react'
import {Grid, GridCell} from '@rmwc/grid';
import {TabBar, Tab} from '@rmwc/tabs';
import {
  List,
  SimpleListItem
} from '@rmwc/list';
import {TextField} from '@rmwc/textfield';
import {Button} from '@rmwc/button';
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {LinearProgress} from '@rmwc/linear-progress';

import DetailExtraDialog from './DetailExtraDialog';

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
  constructor() {
    super()

    this.addDish = this.addDish.bind(this)
    this.removeDish = this.removeDish.bind(this)
    this.changeTextField = this.changeTextField.bind(this)
    this.selectDish = this.selectDish.bind(this)

    this.saveExtras = this.saveExtras.bind(this)
  }

  state = {
    id: "",
    name: "",
    table: 0,
    notes: "",
    dishes: [],
    activeTabIndex: 0,
    dishTypes: {},
    extras: {},
    selectedChip: {}
  }

  componentDidMount() {
    if (this.props.order)
      this.setState({
        id: this.props.order._id,
        name: this.props.order.name,
        table: this.props.order.table,
        notes: this.props.order.notes,
        dishes: this.props.order.dishes.map(d => {return {dish: {id: d.dish._id, name: d.dish.name, typeName: d.dish.type.name}, made: d.made, hasPayed: d.hasPayed, extras: d.extras, delivered: d.delivered}})
      })

    const dishTypes = this.state.dishTypes
    this.props.dishes.forEach(d => {
      if (dishTypes[d.type.name]) {
        dishTypes[d.type.name].push(d)
      } else {
        dishTypes[d.type.name] = [d]
      }
    });

    const extras = this.state.extras
    this.props.extras.forEach(e => {
      if (extras[e.type.name]) {
        extras[e.type.name].push(e)
      } else {
        extras[e.type.name] = [e]
      }
    });

    this.setState({
      dishTypes: dishTypes,
      extras: extras
    })
  }

  addDish(id, name, typeName) {
    const dishes = [{dish: {id, name, typeName}, made: false, hasPayed: false}].concat(this.state.dishes)
    this.setState(
      {
        dishes: dishes
      })
  }

  removeDish() {
    const id = this.state.selectedDishId
    let dishes = this.state.dishes

    if (dishes.length < id) return
    if (dishes[id].hasPayed || dishes[id].made) return

    if (dishes.length === 1)
      dishes = []
    else
      dishes.splice(id, 1)
    this.setState({dishes: dishes})
  }

  changeTextField(field) {
    return (e) => {
      const state = {}
      state[field] = e.target.value
      this.setState(state)
    }
  }

  selectDish(id) {
    const {dishes} = this.state

    if (!dishes || dishes.length < id) return;
    const dish = dishes[id].dish;

    if (dish.hasPayed || dish.made) return;

    var currentDish = this.props.dishes.find(d => d._id === dish.id)
    this.setState({
      openDialog: true,
      selectedDish: dish,
      selectedDishId: id,
      selectableExtras: this.state.extras[dishes[id].dish.typeName].filter(e => !currentDish.deselectedExtras.some(d => d._id === e._id)),
      dishExtras: dishes[id].extras
    })
  }

  saveExtras(extras) {
    const dishes = this.state.dishes;
    const dish = dishes[this.state.selectedDishId];

    dish.extras = extras

    this.setState({
      "dishes": dishes,
    })
  }

  render() {
    const keys = Object.keys(this.state.dishTypes).sort((a, b) => a < b ? -1 : 1)
    const {state, props, selectDish} = this

    return (
      <React.Fragment>
        <Grid className="order-details">
          <GridCell span="12">
            {keys.length === 0 ? String() :
              <TabBar
                activeTabIndex={state.activeTabIndex}
                onActivate={evt => {
                  this.setState({'activeTabIndex': evt.detail.index})
                }}
              >
                {keys.map((v, i) => <Tab key={i}>{v}</Tab>)}
              </TabBar>
            }
            <List>
              {
                (state.dishTypes[keys[state.activeTabIndex]] || []).sort((a, b) => a.name < b.name ? -1 : 1).map((v, i) => {
                  var occur = state.dishes.reduce((c, d) => c + (d.dish.id === v._id ? 1 : 0), 0)
                  return (
                    <SimpleListItem
                      key={i}
                      onClick={_ => this.addDish(v._id, v.name, keys[state.activeTabIndex])}
                      text={v.name}
                      graphic={occur ? "check" : "none "}
                      meta={occur ? occur : null} />)
                }
                )}
            </List>

          </GridCell>
        </Grid>
        <Grid className="order-details">
          <GridCell span="6">
            <List className="extendSecondaryText">
              {state.dishes.map((v, i) =>
                <SimpleListItem
                  onClick={() => {
                    if (v.hasPayed || v.made || v.delivered) return;
                    selectDish(i)
                  }}
                  key={i}
                  text={v.dish.name}
                  secondaryText={(v.extras || []).map(e => e.name).join(", ")}
                  graphic={v.hasPayed ? "euro_symbol" : v.delivered ? "done_all" : v.made ? "done" : "remove"}
                  ripple={false}
                  activated={false}
                  disabled={v.hasPayed || v.made || v.delivered}
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
                dishes: state.dishes.map(d => {return {id: d.dish.id, made: d.made, hasPayed: d.hasPayed, delivered: d.delivered, extras: (d.extras || []).map(e => e._id)}}).filter(d => d && d.id)
              }
            })} theme="secondary">Save</Button>

            if (loading)
              result =
                <React.Fragment>
                  <LinearProgress />
                  {result}
                </React.Fragment>
            if (error) console.error(error);

            if (data) props.history.goBack()

            return result
          }}
        </Mutation>
        <DetailExtraDialog
          open={this.state.openDialog}
          onClose={() => this.setState({openDialog: false})}
          dish={this.state.selectedDish}
          onDelete={this.removeDish}
          onSave={this.saveExtras}
          extras={this.state.selectableExtras}
          selectedExtras={this.state.dishExtras}
        />
      </React.Fragment>
    )
  }
}
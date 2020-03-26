import React, {useState} from 'react'
import {Grid, GridCell} from '@rmwc/grid';
import {TabBar, Tab} from '@rmwc/tabs';
import {
  List,
  SimpleListItem
} from '@rmwc/list';
import {TextField} from '@rmwc/textfield';
import {Button} from '@rmwc/button';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {LinearProgress} from '@rmwc/linear-progress';
import {useHistory, useParams} from 'react-router-dom';

import DetailExtraDialog from './DetailExtraDialog';

import './Details.css'

const ADD_ORDER = gql`
  mutation addOrder($name: String, $table: Int!, $notes: String, $dishes: [orderDishMutation]!){
    addOrder(table: $table, name: $name, dishes: $dishes, notes: $notes){
      _id, 
      name,
      table,
      notes
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $name: String, $table: Int, $notes: String, $dishes: [orderDishMutation]){
    updateOrder(_id: $id, table: $table, name: $name, dishes: $dishes, notes: $notes ){
      _id, 
      name,
      table,
      notes
    }
  }
`;

function addDish(id, name, typeName, dishes, setDishes) {
  setDishes([{dish: {id, name, typeName}, made: false, hasPayed: false}].concat(dishes))
}

const removeDish = (id, dishes, setDishes) => () => {
  if (dishes.length < id) return
  if (dishes[id].hasPayed || dishes[id].made) return

  let newDishes = dishes.filter((_, idx) => idx !== id)
  setDishes(newDishes)
}

function selectDish(id, dishes, setDialog, setSelectedDishId, setSelectableExtras, extras, allDishes) {

  if (!dishes || dishes.length < id) return;
  const dish = dishes[id].dish;

  if (dish.hasPayed || dish.made) return;

  var currentDish = allDishes.find(d => d._id === dish.id)
  setDialog(true)
  setSelectedDishId(id)
  const selectableExtras = extras.filter(e => !currentDish.deselectedExtras.some(d => d._id === e._id) && e.type.name === currentDish.type.name)
  setSelectableExtras(selectableExtras)
}

const saveExtras = (dishes, selectedDishId, setDishes) => (extras) => {
  dishes[selectedDishId].extras = extras
  setDishes([...dishes])
}

function getDishTypes(dishes) {
  return dishes.reduce((extras, c) => {
    if (extras[c.type.name]) {
      extras[c.type.name].push(c)
    } else {
      extras[c.type.name] = [c]
    }
    return extras
  }, {})
}

function getDishesForType(dishTypes, keys, activeTabIndex, dishes, setDishes) {
  return (dishTypes[keys[activeTabIndex]] || []).sort((a, b) => a.name < b.name ? -1 : 1).map((v, i) => {
    var occur = dishes.reduce((c, d) => c + (d.dish.id === v._id ? 1 : 0), 0)
    return (
      <SimpleListItem
        key={i}
        onClick={_ => addDish(v._id, v.name, keys[activeTabIndex], dishes, setDishes)}
        text={v.name}
        graphic={occur ? "check" : "none "}
        meta={occur ? occur : null} />)
  })
}

const DetailContent = (props) => {
  const [name, setName] = useState(props.order ? props.order.name : "")
  const [dialogState, setDialogState] = useState(false)
  const [table, setTable] = useState(props.order ? props.order.table : 0)
  const [notes, setNotes] = useState(props.order ? props.order.notes : "")
  const [dishes, setDishes] = useState(props.order ? props.order.dishes.map(d => ({...d, dish: {id: d.dish._id, name: d.dish.name, typeName: d.dish.type.name}})) : [])
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [dishTypes] = useState(getDishTypes(props.dishes))
  const [keys] = useState(Object.keys(dishTypes).sort((a, b) => a < b ? -1 : 1))
  const [selectedDishId, setSelectedDishId] = useState(-1)
  const [selectableExtras, setSelectableExtras] = useState([])

  const {id} = useParams()
  const history = useHistory()
  const [addOrUpdate, {data, loading, error}] = useMutation(id ? UPDATE_ORDER : ADD_ORDER);

  let result = <Button onClick={() => addOrUpdate({
    variables: {
      id: id,
      table: table ? parseInt(table) : 0,
      name: name,
      notes: notes,
      dishes: dishes.map(d => {return {id: d.dish.id, made: d.made, hasPayed: d.hasPayed, delivered: d.delivered, extras: (d.extras || []).map(e => e._id)}}).filter(d => d && d.id)
    }
  })} theme="secondary">Save</Button>
  if (error) console.error(error);
  if (data) history.goBack()

  return (
    <React.Fragment>
      <Grid className="order-details">
        <GridCell span="12">
          {keys.length === 0 ? String() :
            <TabBar
              activeTabIndex={activeTabIndex}
              onActivate={evt => setActiveTabIndex(evt.detail.index)}
            >
              {keys.map((v, i) => <Tab key={i}>{v}</Tab>)}
            </TabBar>
          }
          <List>
            {getDishesForType(dishTypes, keys, activeTabIndex, dishes, setDishes)}
          </List>

        </GridCell>
      </Grid>
      <Grid className="order-details">
        <GridCell span="6">
          <List className="extendSecondaryText">
            {dishes.map((v, i) =>
              <SimpleListItem
                onClick={() => {
                  if (v.hasPayed || v.made || v.delivered) return;
                  selectDish(i, dishes, setDialogState, setSelectedDishId, setSelectableExtras, props.extras, props.dishes)
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
          <TextField icon="event_seat" label="Table" type="number" min="0" inputMode="numeric" pattern="\d*" value={table} onChange={(e) => setTable(e.target.value)} />
          <TextField icon="account_circle" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField textarea fullwidth label="Notes" type="number" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </GridCell>
      </Grid>
      {loading ? <LinearProgress /> : <></>}
      {error ? <span>{error.message}</span> : <></>}
      {result}
      <DetailExtraDialog
        open={dialogState}
        onClose={() => setDialogState(false)}
        dish={dishes[selectedDishId] ? dishes[selectedDishId].dish : undefined}
        onDelete={removeDish(selectedDishId, dishes, setDishes)}
        onSave={saveExtras(dishes, selectedDishId, setDishes)}
        extras={selectableExtras}
        selectedExtras={dishes[selectedDishId] ? dishes[selectedDishId].extras || [] : []}
      />
    </React.Fragment>
  )
}

export default DetailContent
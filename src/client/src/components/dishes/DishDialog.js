import React, {useState, useEffect} from 'react'
import {useQuery, useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogButton
} from '@rmwc/dialog'
import {Chip, ChipSet} from '@rmwc/chip';
import {TextField} from '@rmwc/textfield';
import {Select} from '@rmwc/select';

const ADD = gql` mutation add($name: String!, $cost: Float!, $type: ID!, $deselectedExtras: [ID]){
 addDish(name: $name, cost: $cost, type: $type, deselectedExtras: $deselectedExtras){
   _id, 
   name
 }
}`
const UPDATE = gql`mutation update($id: ID!, $name: String, $cost: Float, $type: ID, $deselectedExtras: [ID]){
 updateDish(_id: $id, name: $name, cost: $cost, type: $type, deselectedExtras: $deselectedExtras){
   _id, 
   name
 }
}`
const REMOVE = gql`mutation remove($id: ID!){
 removeDish(_id: $id, ){
   _id, 
   name
 }
}`

const GET_DISH_EXTRAS = gql`
query dishExtras($typeId: ID) {
  dishExtras(type: $typeId) {
    _id,
    name
  }
}`

const handleDeselectedExtraChange = (deselectedExtras, setDeselectedExtras) => (e) => {
  const id = deselectedExtras.indexOf(e.target.chipId)
  if (id > -1) {
    setDeselectedExtras(deselectedExtras.filter((_, idx) => idx !== id))
  } else {
    setDeselectedExtras([...deselectedExtras, e.target.chipId])
  }
}

const DishDialog = (props) => {
  const [name, setName] = useState(props.name || '')
  const [cost, setCost] = useState(props.cost || 0)
  const [type, setType] = useState(props.type ? props.type._id : '')
  const [deselectedExtras, setDeselectedExtras] = useState((props.deselectedExtras || []).map(de => de._id))

  useEffect(() => {
    setName(props.name || '')
    setCost(props.cost || 0)
    setType(props.type ? props.type._id : '')
    setDeselectedExtras((props.deselectedExtras || []).map(de => de._id))
  }, [props.name, props.cost, props.type, props.deselectedExtras])

  const [remove] = useMutation(REMOVE)
  const [addOrUpdate] = useMutation(props._id ? UPDATE : ADD)
  const {data = {dishExtras: []}} = useQuery(GET_DISH_EXTRAS, {variables: {typeId: type || null}})

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>{props._id ? `Edit ${props.name}` : "New dish"}</DialogTitle>
      <DialogContent>
        <TextField type="text" label="Name" value={name} onChange={(e) => setName(e.target.value || '')} />
        <TextField 
          type="number"
          inputMode="numeric"
          label="Cost"
          invalid={false}
          value={cost} 
          onChange={(e) => setCost(e.target.value)} />
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder=""
          label="Dish type"
          options={props.dishTypes}
        />
        <ChipSet>
          {(data.dishExtras).map(e => 
            <Chip 
              key={e._id} 
              label={e.name} 
              checkmark 
              selected={!deselectedExtras.some(de => de === e._id)} 
              onInteraction={handleDeselectedExtraChange(deselectedExtras, setDeselectedExtras)} />)
          }
        </ChipSet>
      </DialogContent>
      <DialogActions>
        <DialogButton theme="secondary" action="close" isDefaultAction>
          Cancel
        </DialogButton>
        <DialogButton action="accept" onClick={() => remove({variables: {id: props._id}})} disabled={!props._id}>
          Delete
        </DialogButton >
        <DialogButton action="accept" onClick={() => {
          const floatCost = parseFloat(cost)
          addOrUpdate({variables: {
              id: props._id, 
              name: name, 
              type: type,
              cost: floatCost,
              deselectedExtras: deselectedExtras
            }})
        }}>
          Save
        </DialogButton>
      </DialogActions>
    </Dialog>)
}

export default DishDialog
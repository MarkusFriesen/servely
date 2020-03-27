import React, {useState, useEffect} from 'react';
import {useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogButton
} from '@rmwc/dialog'
import {TextField} from '@rmwc/textfield';
import {Select} from '@rmwc/select';

const ADD = gql` mutation add($name: String!, $cost: Float!, $type: ID!){
 addDishExtra(name: $name, cost: $cost, type: $type) {
   _id, 
   name
 }
}`
const UPDATE = gql`mutation update($id: ID!, $name: String!, $cost: Float!, $type: ID!){
 updateDishExtra(_id: $id, name: $name, cost: $cost, type: $type) {
   _id, 
   name
 }
}`
const REMOVE = gql`mutation remove($id: ID!){
 removeDishExtra(_id: $id, ) {
   _id, 
   name
 }
}`

function toggleDialog(setName, setCost, setType, props) {
  setName(props.name || '')
  setCost(props.cost || 0)
  setType(props.type ? props.type._id : '')
}

const ExtraDialog = (props) => {
  const [name, setName] = useState(props.name || '')
  const [cost, setCost] = useState(props.cost ? props.cost.toFixed(2) : 0)
  const [type, setType] = useState(props.type ? props.type._id : '')

  useEffect(() => {
    setName(props.name || '')
    setCost(props.cost ? props.cost.toFixed(2) : 0)
    setType(props.type ? props.type._id : '')
  }, [props.name, props.cost, props.type])

  const isNewExtra = !props._id
  const [remove] = useMutation(REMOVE)
  const [addOrUpdate] = useMutation(isNewExtra ? ADD : UPDATE)
  return (
    <Dialog
      open={props.open}
      onClose={() => {
        toggleDialog(setName, setCost, setType, props)
        props.onClose()
      }}
    >
      <DialogTitle>{!isNewExtra ? `Edit ${props.name}` : "New extra for dish type"}</DialogTitle>
      <DialogContent>
        <TextField type="text" label="Name" value={name} onChange={(e) => setName(e.target.value || '')} />
        <TextField type="number" inputMode="numeric" label="Cost" invalid={false} value={cost} onChange={(e) => setCost(e.target.value)} />
        <Select value={type} onChange={(e) => setType(e.target.value)} placeholder="" label="Dish type" options={props.dishTypes} />
      </DialogContent>
      <DialogActions>
        <DialogButton theme="secondary" action="cloase" isDefaultAction>Cancel</DialogButton>
        <DialogButton action="accept" onClick={() => remove({variables: {id: props._id}})} disabled={isNewExtra}>
          Delete
        </DialogButton >
        <DialogButton action="accept" onClick={() => {
          addOrUpdate({
            variables: {
              id: props._id,
              name: name,
              type: type,
              cost: parseFloat(cost)
            }
          })
        }}>
          Save
        </DialogButton>
      </DialogActions>
    </Dialog>
  )
}

export default ExtraDialog
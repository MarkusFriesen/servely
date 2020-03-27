import React, {useState, useEffect} from 'react'
import {useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogButton
} from '@rmwc/dialog';
import {TextField} from '@rmwc/textfield';

const ADD = gql` mutation add($name: String!){
 addDishType(name: $name){
   _id, 
   name
 }
}`
const UPDATE = gql`mutation update($id: ID!, $name: String!){
 updateDishType(_id: $id, name: $name){
   _id, 
   name
 }
}`
const REMOVE = gql`mutation remove($id: ID!){
 removeDishType(_id: $id, ){
   _id, 
   name
 }
}`

const DishTypeDialog = (props) => {
  const [name, setName] = useState(props.name || '')
  const {isDialogOpen, setIsDialogOpen} = props

  useEffect(() => {
    setName(props.name || '')
  }, [props.name])

  const isNewDishType = !props._id
  const [remove] = useMutation(REMOVE)
  const [addOrUpdate] = useMutation(isNewDishType ? ADD : UPDATE)

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
    >
      <DialogTitle>{isNewDishType ? "Edit dish type" : "New dish type"}</DialogTitle>
      <DialogContent>
        <TextField type="text" label="Name" value={name} onChange={(e) => setName(e.target.value || '')} />
      </DialogContent>
      <DialogActions >
        <DialogButton theme="secondary" action="cancel" isDefaultAction >
          Cancel
          </DialogButton>
        <DialogButton action="accept" onClick={() => remove({variables: {id: props._id}})} disabled={isNewDishType} >
          Delete
          </DialogButton>
        <DialogButton action="accept" onClick={() => addOrUpdate({variables: {id: props._id, name: name}})}>
          Save
          </DialogButton>
      </DialogActions>
    </Dialog>
  )
}

export default DishTypeDialog
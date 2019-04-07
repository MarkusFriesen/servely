import React, { Component } from 'react'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogButton
} from '@rmwc/dialog'
import { TextField } from '@rmwc/textfield';
import { Select } from '@rmwc/select';

const ADD = gql` mutation add($name: String!, $cost: Float!, $type: ID!){
 addDish(name: $name, cost: $cost, type: $type){
   _id, 
   name
 }
}`
const UPDATE = gql`mutation update($id: ID!, $name: String, $cost: Float, $type: ID){
 updateDish(_id: $id, name: $name, cost: $cost, type: $type){
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

export default class DishDialog extends Component {
  constructor(props) {
    super(props)
    this.state = { name: '', cost: 0.00, type: '' }

    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleCostChange = this.handleCostChange.bind(this)
    this.handleTypeChange = this.handleTypeChange.bind(this)
  }

  componentWillReceiveProps(newProps, oldProps) {
    if (newProps._id && (newProps.name !== oldProps.name || newProps.cost !== oldProps.cost || newProps.type._id !== oldProps.type._id)) {
      this.setState({ name: newProps.name, cost: newProps.cost.toFixed(2), type: newProps.type._id })
    }
  }

  componentDidMount() {
    if (this.props._id)
      this.setState({ name: this.props.name, cost: this.props.cost.toFixed(2), type: this.props.type._id })
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value || '' })
  }

  handleCostChange(e) {
    this.setState({ cost: e.target.value })
  }

  handleTypeChange(e) {
    this.setState({ type: e.target.value })
  }

  toggleDialog() {
    return () => {
      this.setState({ name: this.props.name || "", cost: this.props.cost || 0, type: this.props.type ? this.props.type._id : '', standardDialogOpen: !this.state.standardDialogOpen })
    }
  }

  render(){
    return (
    <React.Fragment>
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
      >
          <DialogTitle>{this.props._id ? `Edit ${this.props.name}` : "New dish"}</DialogTitle>
   
          <DialogContent>
            <TextField type="text" label="Name" value={this.state.name } onChange={this.handleNameChange} />
            <TextField type="number" inputMode="numeric" label="Cost" invalid={false} value={this.state.cost} onChange={this.handleCostChange} />
            <Select
              value={this.state.type}
              onChange={this.handleTypeChange}
              placeholder=""
              label="Dish type"
              options={this.props.dishTypes}
            />
          </DialogContent>
          <DialogActions>
            <DialogButton  theme="secondary" action="cloase" isDefaultAction>Cancel</DialogButton>
            {
              this.props._id ?
                <Mutation mutation={REMOVE}>
                  {(remove) =>
                    <DialogButton action="accept" onClick={() => remove({ variables: { id: this.props._id } }) }>Delete</DialogButton >
                  }
                </Mutation>
                : String()
            }
            <Mutation mutation={this.props._id ? UPDATE : ADD}>
              {(addOrUpdate) =>
                <DialogButton action="accept" onClick={() => {
                  addOrUpdate({ variables: { id: this.props._id, name: this.state.name, type: this.state.type, cost: this.state.cost } })}}>Save</DialogButton>
              }
            </Mutation>
          </DialogActions>
      </Dialog>
    </React.Fragment>)
  }
}
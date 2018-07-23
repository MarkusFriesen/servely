import React, { Component } from 'react'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Fab } from 'rmwc/Fab';
import {
  Dialog,
  DialogSurface,
  DialogHeader,
  DialogHeaderTitle,
  DialogBody,
  DialogFooter,
  DialogFooterButton,
  DialogBackdrop
} from 'rmwc/Dialog'
import { TextField } from 'rmwc/TextField';
import {
  SimpleListItem
} from 'rmwc/List'; 
import { Select } from 'rmwc/Select';

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
    this.state = { name: '', cost: 0.00, type: '', standardDialogOpen: false }

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
        open={this.state.standardDialogOpen}
        onClose={evt => this.setState({ standardDialogOpen: false })}
      >
        <DialogSurface>
          <DialogHeader>
            <DialogHeaderTitle>{this.props._id ? `Edit ${this.props.name}` : "New dish"}</DialogHeaderTitle>
          </DialogHeader>
          <DialogBody>
            <TextField type="text" label="Name" value={this.state.name } onChange={this.handleNameChange} />
            <TextField type="number" inputMode="numeric" label="Cost" invalid={false} value={this.state.cost} onChange={this.handleCostChange} />
            <Select
              value={this.state.type}
              onChange={this.handleTypeChange}
              placeholder=""
              label="Dish type"
              options={this.props.dishTypes}
            />
          </DialogBody>
          <DialogFooter>
            <DialogFooterButton theme="secondary" cancel>Cancel</DialogFooterButton>
            {
              this.props._id ?
                <Mutation mutation={REMOVE}>
                  {(remove) =>
                    <DialogFooterButton accept onClick={() => remove({ variables: { id: this.props._id } })}>Delete</DialogFooterButton>
                  }
                </Mutation>
                : String()
            }
            <Mutation mutation={this.props._id ? UPDATE : ADD}>
              {(addOrUpdate) =>
                <DialogFooterButton accept onClick={() => {
                  addOrUpdate({ variables: { id: this.props._id, name: this.state.name, type: this.state.type, cost: this.state.cost } })}}>Save</DialogFooterButton>
              }
            </Mutation>
          </DialogFooter>
        </DialogSurface>
        <DialogBackdrop />
      </Dialog>
      {
        this.props._id ?
          <SimpleListItem key={this.props._id} onClick={this.toggleDialog()} text={this.props.name} secondaryText={`€ ${this.props.cost.toFixed(2)}`} meta="edit" />:
          <Fab className="floating-right" icon="add"  onClick={this.toggleDialog()} />
      }
    </React.Fragment>)
  }
}
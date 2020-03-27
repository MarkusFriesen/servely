import React, {Component} from 'react'
import {Mutation, Query} from "react-apollo";
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

export default class DishDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {name: '', cost: 0.00, type: '', deselectedExtras: []}

    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleCostChange = this.handleCostChange.bind(this)
    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.hanldeDeselectedExtraChange = this.handleDeselectedExtraChange.bind(this)
  }

  componentWillReceiveProps(newProps, oldProps) {
    if (newProps._id && (newProps.name !== oldProps.name || newProps.cost !== oldProps.cost || newProps.type._id !== oldProps.type._id || newProps.deselectedExtras.length !== oldProps.deselectedExtras.length)) {
      this.setState({name: newProps.name, cost: newProps.cost.toFixed(2), type: newProps.type._id, deselectedExtras: newProps.deselectedExtras.map(de => de._id)})
    }
  }

  componentDidMount() {
    if (this.props._id)
      this.setState({name: this.props.name, cost: this.props.cost.toFixed(2), type: this.props.type._id, deselectedExtras: this.props.deselectedExtras.map(de => de._id)})
  }

  handleNameChange(e) {
    this.setState({name: e.target.value || ''})
  }

  handleCostChange(e) {
    this.setState({cost: e.target.value})
  }

  handleTypeChange(e) {
    this.setState({type: e.target.value})
  }

  handleDeselectedExtraChange(e){
    const id = this.state.deselectedExtras.indexOf(e.target.chipId)
    if (id > -1) {
      const deselectedExtras = [...this.state.deselectedExtras]
      deselectedExtras.splice(id, 1)
      this.setState({deselectedExtras: deselectedExtras})
    } else {
      this.setState({deselectedExtras: [...this.state.deselectedExtras, e.target.chipId]})
    }
  }

  toggleDialog() {
    return () => {
      this.setState({name: this.props.name || "", cost: this.props.cost || 0, type: this.props.type ? this.props.type._id : '', standardDialogOpen: !this.state.standardDialogOpen})
    }
  }

  render() {
    return (
      <Query
        query={gql`query dishExtras($typeId: ID) {
              dishExtras(type: $typeId) {
                _id,
                name
              }
            }`}
        variables={{typeId: this.state.type ? this.state.type :  null}}>
        {({loading, error, data}) => {
          
          return (
            <Dialog
              open={this.props.open}
              onClose={this.props.onClose}
            >
              <DialogTitle>{this.props._id ? `Edit ${this.props.name}` : "New dish"}</DialogTitle>

              <DialogContent>
                <TextField type="text" label="Name" value={this.state.name} onChange={this.handleNameChange} />
                <TextField type="number" inputMode="numeric" label="Cost" invalid={false} value={this.state.cost} onChange={this.handleCostChange} />
                <Select
                  value={this.state.type}
                  onChange={this.handleTypeChange}
                  placeholder=""
                  label="Dish type"
                  options={this.props.dishTypes}
                />
                <ChipSet>
                  {(data.dishExtras || []).map(e => <Chip key={e._id} label={e.name} checkmark selected={!this.state.deselectedExtras.some(de => de === e._id)} onInteraction={this.handleDeselectedExtraChange}/>)}
                </ChipSet>
              </DialogContent>
              <DialogActions>
                <DialogButton theme="secondary" action="close" isDefaultAction>Cancel</DialogButton>
                {
                  this.props._id ?
                    <Mutation mutation={REMOVE}>
                      {(remove) =>
                        <DialogButton action="accept" onClick={() => remove({variables: {id: this.props._id}})}>Delete</DialogButton >
                      }
                    </Mutation>
                    : String()
                }
                <Mutation mutation={this.props._id ? UPDATE : ADD}>
                  {(addOrUpdate) =>
                    <DialogButton action="accept" onClick={() => {
                      addOrUpdate({variables: {id: this.props._id, name: this.state.name, type: this.state.type, cost: this.state.cost, deselectedExtras: this.state.deselectedExtras}})
                    }}>Save</DialogButton>
                  }
                </Mutation>
              </DialogActions>
            </Dialog>)
        }}
      </Query>)
  }
}
import React from "react";
import { Link } from "react-router"
import { map } from "lodash";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Name, Label, Button, CardLink } from "reactstrap"
import { observer, inject } from 'mobx-react'

@inject('dishStore')
@observer
export default class DishModal extends React.Component {
  constructor(){
    super();

    this.setDish = this.setDish.bind(this)

    this.state = {
      name: "",
      type: "",
      cost: 0,
      description: "",
      open: false,
      modal: false
    }
  }

  componentWillMount(){
    this.setDish()
  }

  setDish(){
    if (this.props.id) {
      const dish = this.props.dishStore.getDish(this.props.id)
      if (dish){
        this.setState({
          name: dish.name,
          cost: dish.cost,
          description: dish.description,
          type: dish.type
        })
      }
    }
    else {
      this.setState({
        name: "",
        cost: 0,
        description: "",
        type: ""
      })
    }
  }

  toggle(){
    this.setState({
      modal: !this.state.modal
    })

    this.setDish()
  }

  open(id){
    this.setState({
      modal: true
    })
  }

  close(){
    this.setState({
      modal: false
    })

    this.setDish()
  }

  addDish(){
    this.props.dishStore.createDish(this.state.name, this.state.cost, this.state.description, this.state.type, () => { this.close() }, (e) => { console.error(e) })
  }

  updateDish(){
    this.props.dishStore.updateDish(this.props.id, this.state.name, this.state.cost, this.state.description, this.state.type, () => this.close(), (e) => { console.error(e) })
  }

  handleName(e){
    this.setState({
        name: e.target.value
    })
  }

  handletype(e){
    this.setState({
        type: e.target.value
    })
  }

  handlecost(e){
    this.setState({
        cost: e.target.value
    })
  }

  handleDescription(e){
    this.setState({
        description: e.target.value
    })
  }

  render() {
    const toggle = this.toggle.bind(this)

    return (
      <div class="dish-details">
        { !this.props.id ? <Button color="primary" class='btn-rnd' onClick={this.open.bind(this)}>+</Button> : <CardLink onClick={this.open.bind(this)}><i class="fa fa-pencil primary fa-2x"></i></CardLink> }
        <Modal isOpen={this.state.modal} toggle={toggle} class="dish-modal">
          <ModalHeader toggle={toggle}>Dish</ModalHeader>
          <ModalBody>
            <Label>Name
              <Input type="text" name="Name" placeholder="Dish name" value={this.state.name} onChange={this.handleName.bind(this)} />
            </Label><br/>
            <Label>Description
              <Input type="textarea" name="Description" placeholder="Dish description" value={this.state.description} onChange={this.handleDescription.bind(this)} />
            </Label><br/>
            <Label>Cost
              <Input type="number" name="cost" placeholder="Table number" value={this.state.cost} onChange={this.handlecost.bind(this)} />
            </Label><br/>
            <Label>Type
              <Input type="text" name="type" placeholder="Dish type" value={this.state.type} onChange={this.handletype.bind(this)} />
            </Label><br/><br/>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={ !this.props.id ? this.addDish.bind(this) : this.updateDish.bind(this)}>Save</Button>
            <Button color="secondary" onClick={this.close.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

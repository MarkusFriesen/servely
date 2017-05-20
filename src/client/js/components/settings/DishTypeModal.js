import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input, Button, Form, FormGroup, Label } from "reactstrap"
import { inject, observer } from "mobx-react"

import Toast from "../Toast"

@inject('dishTypeStore')
@observer
export default class DishTypeModal extends React.Component {
  constructor(){
    super();

    this.setDishType = this.setDishType.bind(this)
    this.state = {
      name: "",
      modal: false,
      errorMessage: undefined,
    }

    this.toggle = this.toggle.bind(this)
  }

  componentWillMount(){
    this.setDishType()
  }

  setDishType(){
    if (this.props.id){
      const dishType = this.props.dishTypeStore.getDishType(this.props.id)

      if (dishType){
        this.setState({
          name: dishType.name,
          errorMessage: undefined
        })
      }
    }
    else{
      this.setState({
        name: "",
        errorMessage: undefined
      })
    }
  }

  toggle() {
    const modal = this.state.modal
    this.setState({
      modal: !modal
    })

    this.setDishType()
  }

  addDishType(){
    this.props.dishTypeStore.createDishType(this.state.name, () => { this.toggle() }, (e) => { this.setState({errorMessage: e.message }); console.warn(e) })
  }

  updateDishType(){
    this.props.dishTypeStore.updateDishType(this.props.id, this.state.name,() => { this.toggle() }, (e) => { this.setState({errorMessage: e.message }); console.error(e) })
  }

  removeDishType(){
    this.props.dishTypeStore.removeDishType(this.props.id, () => { }, (e) => { this.setState({errorMessage: e.message }); console.error(e) })
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  render() {
    const addDishType = this.addDishType.bind(this)
    const updateDishType = this.updateDishType.bind(this)

    return (
      <div>
        <Toast message={this.state.errorMessage} title="Error" />
        { this.props.id ?
          <i class="fa fa-pencil primary fa-2x" onClick={this.toggle.bind(this)}></i> :
          <Button color="primary" class='btn-rnd' onClick={this.toggle}><i class="fa fa-plus"></i></Button>
        }
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Dish Type</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label>Name</Label>
                <Input type="text" name="Name" placeholder="Dish Type Name" value={this.state.name} onChange={this.handleName.bind(this)} />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={ !this.props.id ? addDishType : updateDishType}>Save</Button>
            { this.props.id ? <Button color="danger" onClick= {this.removeDishType.bind(this)}>Delete</Button> : undefined }
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

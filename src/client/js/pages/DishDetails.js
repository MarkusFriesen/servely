import React from "react"
import { inject, observer } from "mobx-react"
import { Grid, Cell, Textfield, TableHeader, Card, CardText, CardTitle, IconButton, CardMenu, Button, Menu, MenuItem } from "react-mdl"

@inject('dishStore')
@inject('dishTypeStore')
@observer
export default class OrdersDetails extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      name: "",
      cost: "",
      description: "",
      type: this.props.dishTypeStore.dishTypes.length > 0 ? this.props.dishTypeStore.dishTypes[0]._id : undefined,
      dish: undefined
    }; 
  }

  componentWillMount(){
    const id = this.props.match.params.id
    if (id){
      const dish = this.props.dishStore.getDish(id)
      
      this.setState({ name: dish.name,
      cost: dish.cost,
      description: dish.description,
      type: dish.type,
      dish: dish})
    }
  }

  goBack(){
    this.props.history.goBack()
  }

  save(){
    const {name, description, type, cost, dish} = this.state
    if (isNaN(parseFloat(cost))|| !name || !description || !type){
      return;
    }
    if (this.props.match.params.id){
      dish.update({name, description, type, cost}, 
        () => {this.goBack()}, 
        (err) => {console.error(err)}
      )
    }
    else {
      this.props.dishStore.add({name, description, type, cost}, 
        () => {this.goBack()}, 
        (err) => {console.error(err)}
      )
    }
  }

  setDishType(e){
    this.setState({type: e.target.value})
  }

  handelNameChange(e){
    this.setState({name: e.target.value})
  }

  handleDescriptionChange(e){
    this.setState({description: e.target.value})
  }

  handleCostChange(e){
    this.setState({cost: e.target.value})
  }

  render() {
    const goBack = this.goBack.bind(this)
    const save = this.save.bind(this)
    const setDishType = this.setDishType.bind(this)
    const handelNameChange = this.handelNameChange.bind(this)
    const handleDescriptionChange = this.handleDescriptionChange.bind(this)
    const handleCostChange = this.handleCostChange.bind(this)

    const dishTypes = this.props.dishTypeStore.dishTypes.map((d, i) => 
      <option key={i} value={d._id}> { d.name } </option>
    )

    return (
      <Grid className="dish-details">
        <Cell col={12}>
          <Card shadow={1} >
            <CardTitle><IconButton name="close" onClick={goBack}/> Dish Details</CardTitle>
            <CardText>              
              <Textfield
                label="Name"
                value={ this.state.name }
                onChange={ handelNameChange }
                floatingLabel
              /><br/>             
              <Textfield
                label="Description"
                value={ this.state.description }
                onChange={ handleDescriptionChange }
                rows={3}
                floatingLabel
              /><br/>

              <Textfield
                pattern="-?[0-9]*([\.,][0-9]+)?"
                error="Input is not a number!"
                label="Cost"
                floatingLabel
                value={ this.state.cost }
                onChange={ handleCostChange }
              /><br/>

              <select value={this.state.type} onChange={setDishType}>
                { dishTypes }
              </select>
            </CardText>            
            <CardMenu >
              <Button onClick={save} accent>Save</Button>
            </CardMenu>
          </Card>
        </Cell>
      </Grid>
    )
  }
}
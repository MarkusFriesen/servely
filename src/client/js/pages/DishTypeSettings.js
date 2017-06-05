import React from "react"
import { Grid, Cell,Card, CardTitle, CardText, IconButton, Textfield, CardMenu, Button } from "react-mdl"
import { inject, observer } from "mobx-react"

@inject('dishTypeStore')
@observer
export default class DishTypeSettings extends React.Component {   
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      dishType: undefined
    }; 
  }

  componentWillMount(){
    const id = this.props.match.params.id
    if (id){
      const dishType = this.props.dishTypeStore.getDishType(id)
      
      this.setState({name: dishType.name, dishType: dishType})
    }
  }
  
  goBack(){
    this.props.history.goBack()
  }

  handleNameChange(e){
    this.setState({name: e.target.value})
  }

  save(){
    const {dishType, name} = this.state

    if (this.props.match.params.id){
      dishType.update(name, () => {this.goBack()}, (err) => {console.error(err)});
    }
    else {
      this.props.dishTypeStore.add(name, () => {this.goBack()}, (err) => {console.error(err)})
    }
  }

  render() {
    const goBack = this.goBack.bind(this)
    const save = this.save.bind(this)

    const handleNameChange = this.handleNameChange.bind(this)
    return (
      <Grid className="settings">
        <Cell col={12}>
          <Card shadow={2}>
            <CardTitle> <IconButton name="close" onClick={goBack}/> Dish Type</CardTitle>
            <CardText>
              <Textfield
                onChange={handleNameChange}
                label="Name"
                value={ this.state.name }
                floatingLabel
            />
            </CardText>
            <CardMenu >
              <Button onClick={save} accent>Save</Button>
            </CardMenu>
          </Card>
        </Cell>
      </Grid>)
  }
}
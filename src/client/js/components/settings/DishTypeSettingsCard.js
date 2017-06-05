import React from "react";
import { Link } from "react-router-dom"
import { Card, CardTitle, CardText, ListItem, ListItemContent, List, ListItemAction, IconButton, CardMenu, Menu, MenuItem } from 'react-mdl';
import { inject, observer } from "mobx-react"


@inject('dishTypeStore')
@observer
export default class DishTypeSettingsCard extends React.Component {
  removeDishType(id){
    return () => { this.props.dishTypeStore.remove(id, () => {}, (err) => {console.error(err)}) }
  }

  render(){
    const removeDishType = this.removeDishType.bind(this)
    const dishTypes = this.props.dishTypeStore ? this.props.dishTypeStore.filteredDishTypes.map((d, i) => 
      <ListItem key={i}>
        <ListItemContent icon="label" >{ d.name } </ListItemContent>
        <ListItemAction>
          <IconButton name="more_vert" id={`menu-${d._id}${i}`} />
          <Menu target={`menu-${d._id}${i}`} align="right" ripple>
            <Link to={`/setting/dishType/${d._id}`}><MenuItem>Edit</MenuItem></Link>
            <MenuItem onClick={removeDishType(d._id)}>Delete</MenuItem>
          </Menu>
        </ListItemAction>
      </ListItem>
    ) : undefined

    return(
      <Card shadow={2}>
        <CardTitle>Dish Types</CardTitle>
        <CardText>
          { dishTypes }
          <br/>
          <br/>
          <br/>
          <br/>          
          <br/>
        </CardText>
        <CardMenu>
          <Link to={`/setting/dishType`}><IconButton name="add" onClick={this.handleOpenDialog}/></Link>
        </CardMenu>
      </Card>
    )
  }
}
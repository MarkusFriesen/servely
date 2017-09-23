import React from "react";
import { Card, CardTitle, CardText, ListItem, ListItemContent, List, ListItemAction, IconButton, CardMenu } from 'react-mdl';
import { inject, observer } from "mobx-react"
import { Menu, MenuItem } from 'react-mdl-extra'
import { withRouter, Link } from 'react-router-dom'


@inject('dishTypeStore')
@observer
export default class DishTypeSettingsCard extends React.Component {
  removeDishType(id){
    return () => { this.props.dishTypeStore.remove(id, () => {}, (err) => {console.error(err)}) }
  }

  render(){
    const removeDishType = this.removeDishType.bind(this)

    const Action = withRouter(({ history, id }) => 
      <ListItemAction >
        <Menu target={<IconButton name="more_vert" />} align="br tr" ripple>
          <MenuItem onClick={() => { history.push(`/setting/dishType/${id}`)}}>Edit</MenuItem>
          <MenuItem onClick={removeDishType(id)}>Delete</MenuItem>
        </Menu>
      </ListItemAction>
    )

    const dishTypes = this.props.dishTypeStore ? this.props.dishTypeStore.filteredDishTypes.map((d, i) => 
      <ListItem key={i}>
        <ListItemContent icon="label" >{ d.name } </ListItemContent>
        <Action id={d._id} />
      </ListItem>
    ) : undefined

    return(
      <Card shadow={2}>
        <CardTitle>Dish Types</CardTitle>
        <CardText>
          { dishTypes }
        </CardText>
        <CardMenu>
          <Link to={`/setting/dishType`}><IconButton name="add" onClick={this.handleOpenDialog}/></Link>
        </CardMenu>
      </Card>
    )
  }
}
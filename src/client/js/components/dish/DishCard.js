import React from "react";
import { Card, CardTitle, CardText, ListItem, ListItemContent, List, ListItemAction, IconButton } from 'react-mdl';
import { Link } from "react-router-dom"
import { inject } from "mobx-react"
import { Menu, MenuItem } from 'react-mdl-extra'

@inject('dishStore')
export default class DishCard extends React.Component {
  remove(id){
    () => { this.props.dishStore.remove(id, () => {}, (err) => {console.error(err)})}
  }

  render(){
    const remove = this.remove.bind(this)

    const dishes = this.props.dishGroup.map((d, i) => 
      <ListItem key={i} threeLine >
        <ListItemContent icon="label" subtitle={ d.description }>{ d.name } <span class="float-right">{d.cost.toFixed(2)}</span></ListItemContent>
        <ListItemAction >
          <Menu target={<IconButton name="more_vert" />} align="br tr" ripple>
            <Link to={`/dishDetails/${d._id}`}><MenuItem>Edit</MenuItem></Link>
            <MenuItem onClick={remove(d._id)}>Delete</MenuItem>
          </Menu>
        </ListItemAction>
      </ListItem>
    )

    return (
      <div class="masonry-layout__panel">
        <Card shadow={2}>
          <CardTitle>
            <h5>
              <div class="mdl-card__title-text"> { this.props.type ? this.props.type.name : "" } </div>
            </h5>
          </CardTitle>
          <CardText>
            <List >
              { dishes}
            </List>
          </CardText>
        </Card>
      </div>
    )
  }
}
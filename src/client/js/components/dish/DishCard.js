import React from "react";
import { Card, CardTitle, CardText, ListItem, ListItemContent, List, ListItemAction, IconButton } from 'react-mdl';
import { inject } from "mobx-react"
import { Menu, MenuItem } from 'react-mdl-extra'
import { withRouter } from 'react-router-dom'

@inject('dishStore')
export default class DishCard extends React.Component {
  remove(id){
    return () => { this.props.dishStore.remove(id, () => {}, (err) => {console.error(err)}) }
  }

  render(){
    const remove = this.remove.bind(this)

    const Action = withRouter(({ history, id }) => 
      <ListItemAction >
        <Menu target={<IconButton name="more_vert" />} align="br tr" ripple>
          <MenuItem onClick={() => { history.push(`/dishDetails/${id}`)}}>Edit</MenuItem>
          <MenuItem onClick={remove(id)}>Delete</MenuItem>
        </Menu>
      </ListItemAction>
      )

    const dishes = this.props.dishGroup.map((d, i) => 
      <ListItem key={i} threeLine >
        <ListItemContent icon="label" subtitle={ d.description }>{ d.name } <span class="float-right">{d.cost.toFixed(2)}</span></ListItemContent>
        <Action id={d._id} />
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
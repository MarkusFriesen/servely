import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { Elevation } from 'rmwc/Elevation';
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle,
  ToolbarIcon
} from 'rmwc/Toolbar'; 
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryText,
  ListItemMeta
} from 'rmwc/List';
import { LinearProgress } from 'rmwc/LinearProgress';
import FileSaver from "filesaver.js-npm"

export default class History extends Component {


  downloadData(data){
    const blob = new Blob(
      data.map(o => `${o.timestamp.toISOString()},${o.name},${o.type},${o.cost}\n`), { type: "text/plain;charset=utf-8" })
    FileSaver.saveAs(blob, `Orders.csv`, true)
  }
  render() {
    const { id } = this.props.match.params
    return (
      <Elevation className="main-elevation" z={24}>
        <Query
          query={gql`
            {
              orders(hasPayed: true) {
                timestamp
                dishes {
                  dish {
                    name,
                    cost,
                    type{
                      name
                    } 
                  }
                }
              }
            }`}>
          {({ loading, error, data }) => {
            if (loading) return <LinearProgress determinate={false}></LinearProgress>;
            if (error) return <p>Error :(</p>;

            if (id) {
              return this.fetchData(id, data.dishes)
            }

            var ordered = []
            if (data && data.orders)
              data.orders.forEach(o => {
                o.dishes.forEach(d => {
                  ordered.push({ timestamp: new Date(o.timestamp), name: d.dish.name, cost: d.dish.cost.toFixed(2), type: d.dish.type.name })
                })
              })

            return (
              <React.Fragment>
                <Toolbar>
                  <ToolbarRow>
                    <ToolbarSection alignStart>
                      <ToolbarTitle>History</ToolbarTitle>
                    </ToolbarSection>
                    <ToolbarSection alignEnd>
                      <ToolbarIcon use="cloud_download" onClick={() => this.downloadData(ordered)} />
                    </ToolbarSection>
                  </ToolbarRow>
                </Toolbar>
                <List>{
                  ordered.map((o, i) => 
                    <ListItem key={i} >
                      <ListItemText>{o.name}
                        <ListItemSecondaryText> {o.timestamp.toDateString()} </ListItemSecondaryText>
                      </ListItemText>
                      <ListItemMeta tag="span" basename="" >{`€ ${o.cost}`}</ListItemMeta>
                    </ListItem>
                  )}
                </List>
              </React.Fragment>
            )
          }}
        </Query>
      </Elevation>
    )
  }
}
import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { LinearProgress } from '@rmwc/linear-progress';
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle
} from '@rmwc/toolbar';
import {
  List
} from '@rmwc/list';
import DishTypeDialog from './DishTypeDialog';

export default class DishTypes extends Component {
  render() {
    return (
      <React.Fragment>
        <Toolbar>
          <ToolbarRow>
            <ToolbarSection alignStart>
              <ToolbarTitle>Dish types</ToolbarTitle>
            </ToolbarSection>
            <ToolbarSection alignEnd>
              <DishTypeDialog />
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>
        <Query
          query={gql`query dishTypes {
              dishTypes {
                _id,
                name
                }
              }`}
          variables={{ hasPayed: false }}
          pollInterval={1000}>
          {({ loading, error, data }) => {
            if (!data || !data.dishTypes)
              data = {dishTypes: []}

            let result = <List>{
                data.dishTypes.map(d => 
                  <DishTypeDialog key={d._id} {...d}/>
                )}
              </List>

            if (loading) result =
              <React.Fragment>
                <LinearProgress determinate={false}></LinearProgress>
                {result}
              </React.Fragment>
            if (error) return <p>Error :(</p>;
            return(result)
            }
          }
          </Query>
      </React.Fragment>
    )
  }
}
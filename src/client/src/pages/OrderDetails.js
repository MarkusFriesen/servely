import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { Elevation } from '@rmwc/elevation';
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle,
  ToolbarIcon
} from '@rmwc/toolbar';
import { LinearProgress } from '@rmwc/linear-progress';

import DetailContent from "../components/order-details/DetailContent"


export default class OrderDetails extends Component {
  fetchData(id, dishes, extras){
    return <Query
      query={gql`
        query order($id: ID) {
          orders(_id: $id) {
            _id,
            name,
            table,
            notes,
            dishes {
              dish {
                _id,
                name,
                type {
                  _id,
                  name
                }
              }, 
              made,
              hasPayed,
              delivered,
              extras {
                _id,
                name,
                type {
                  _id, 
                  name
                }
              }
            }
          }
        }`} variables={{ id }}>
      {({ loading, error, data }) => {

        if (loading) return <LinearProgress />;
        if (error) {
          console.error(error)
          return <p>Error :( </p>;
          }

        return <DetailContent order={data.orders[0]} dishes={dishes} extras={extras} id={id} history={this.props.history} />
      }}
    </Query>      
  }

  render() {
    const { id } = this.props.match.params
    return (
      <Elevation className="main-elevation" z={24}>
        <Toolbar>
          <ToolbarRow>
            <ToolbarSection alignStart>
              <ToolbarTitle>Order Details</ToolbarTitle>
            </ToolbarSection>
            <ToolbarSection alignEnd>
              <ToolbarIcon icon="clear" onClick={() => this.props.history.goBack()}/>
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>

        <Query
          query={gql`
            {
              dishes {
                _id,
                name,
                type {
                  _id,
                  name
                }
              },
              dishExtras {
                _id,
                name,
                type {
                  _id,
                  name
                }
              }
            }`}>
          {({ loading, error, data }) => {
            if (loading) return <LinearProgress />;
            if (error) {
              return <p>Error :( <br /><br />{error.graphQLErrors.map(({ message }, i) => (
              <span key={i}>{message}</span>))}</p>
            };

            if (id){
              return this.fetchData(id, data.dishes, data.dishExtras)
            }
            return <DetailContent dishes={data.dishes} extras={data.dishExtras} history={this.props.history}/>

          }} 

          </Query>
      </Elevation>
      )
  }
}
import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";

import PayOrderContent from "../components/PayOrderContent"

import { Elevation } from 'rmwc/Elevation';
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle,
  ToolbarIcon
} from 'rmwc/Toolbar';

export default class PayOrder extends Component{
  render() {
    const { id } = this.props.match.params
    return (
      <Elevation className="main-elevation" z={24}>
        <Toolbar>
          <ToolbarRow>
            <ToolbarSection alignStart>
              <ToolbarTitle>Pay Order</ToolbarTitle>
            </ToolbarSection>
            <ToolbarSection alignEnd>
              <ToolbarIcon use="clear" onClick={() => this.props.history.goBack()} />
            </ToolbarSection>
          </ToolbarRow>
        </Toolbar>

        <Query
          query={gql`
                query order($id: ID) {
                  orders(_id: $id) {
                    _id,
                    name,
                    table,
                    dishes {
                      dish {
                        _id,
                        name,
                        cost
                      },
                      hasPayed,
                      made
                    }
                  }
                }`} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;
            
            if (data.orders.length !== 1) return String()
            return <PayOrderContent history={this.props.history} id={id} payedDishes={data.orders[0].dishes.filter(d => d.hasPayed)} dishesToPay={data.orders[0].dishes.filter(d => !d.hasPayed).map(d => { return { dish: d.dish, made: d.made, paying: true } })} />

          }}

        </Query>
      </Elevation>
    )
  }
} 
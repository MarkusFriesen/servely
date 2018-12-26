import React, { Component } from 'react'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  Dialog,
  SimpleDialog
} from '@rmwc/dialog';
import {
  CardAction
} from '@rmwc/card';

import JoinDialogSurface from "./JoinDialogSurface"

export default class JoinOrder extends Component {
  state = {
    standardDialogOpen: false
  }
  render(){
    return (
    <React.Fragment>
        <Query
          query={gql`
                query order($table: Int) {
                  orders(table: $table, hasPayed: false) {
                    _id,
                    name,
                  }
                }`} variables={{ table: this.props.table }} pollInterval={5000}>
          {({ loading, error, data }) => {
            if (!loading && !error && data && data.orders)
              return(
              <Dialog
                open={this.state.standardDialogOpen}
                onClose={evt => this.setState({ standardDialogOpen: false })}
              >
                  <JoinDialogSurface data={data.orders.filter(o => o._id !== this.props._id)} {...this.props}/>
              </Dialog>)
            return (
              <SimpleDialog
                title={`Everyone at table ${this.props.table}`}
                body="Fetching Data"
                open={this.state.standardDialogOpen}
                onClose={evt => this.setState({ standardDialogOpen: false })}
              />
            )

          }}
        </Query>
      <CardAction
          onClick={evt => this.setState({ standardDialogOpen: true })}
        >
          Join
      </CardAction>
    </React.Fragment>)
  }
}
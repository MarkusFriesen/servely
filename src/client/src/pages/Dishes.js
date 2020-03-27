import React, { Component } from 'react';
import { Query } from "react-apollo";
import {gql} from 'apollo-boost';
import Masonry from 'react-masonry-component';
import { Fab } from '@rmwc/fab';

import DishCard from '../components/dishes/DishCard';
import DishDialog from '../components/dishes/DishDialog';
import { LinearProgress } from '@rmwc/linear-progress';
import { observer, inject } from "mobx-react";

class Dishes extends Component {
  state = {
    openDialog: false
  }

  groupBy(xs, func) {
    return xs.reduce(function (rv, x) {
      (rv[func(x)] = rv[func(x)] || []).push(x);
      return rv;
    }, {});
  }

  render() {
    const filter = this.props.store.searchText
    const matchesFilter = new RegExp(filter, "i")
    return (
      <Query
        query={gql`query dishTypes {
              dishTypes {
                _id,
                name
                }
              }`}
        pollInterval={1000}>
        {({ data }) => {
          let dishTypes = []
          if (data && data.dishTypes)
            dishTypes = data.dishTypes.map(d => {return {label: d.name, value: d._id}})
          return (
            <React.Fragment>
              <Query
                query={gql`query dishes {
                  dishes {
                    _id,
                    name,
                    cost,
                    type {
                      _id,
                      name
                    }, 
                    deselectedExtras {
                      _id
                    }
                  }
                }`}
                pollInterval={1000}>
                {({ loading, error, data }) => {
                  if (!data || !data.dishes)
                    data = { dishes: [] }

                  const grouped = this.groupBy(data.dishes.filter(o => {
                    return (!filter || matchesFilter.test(o.name) || matchesFilter.test(o.type.name))
                  }), d => d.type.name)

                  const groupedDishes = []
                  for (const group in grouped) {
                    groupedDishes.push(<div
                      key={grouped[group][0]._id}
                      style={{
                        width: '-webkit-fill-available',
                        maxWidth: '500px',
                        minWidth: '320px'
                      }}>
                      <DishCard typeName={group} dishes={grouped[group]} dishTypes={dishTypes} />
                    </div>)
                  }

                  let result = 
                  <React.Fragment>
                    <Masonry id="masonry-layout">
                      {groupedDishes}
                    </Masonry>
                    <Fab className="floating-right" icon="add"  onClick={() => this.setState({openDialog: true})} />
                  </React.Fragment>

                  if (loading) result =
                    <React.Fragment>
                      <LinearProgress />
                      { result }
                    </React.Fragment>
                  if (error) return <p>Error :(</p>;

                  return result

                }}
              </Query>
              <DishDialog dishTypes={dishTypes} open={this.state.openDialog} onClose={() => this.setState({openDialog: false})}/>
              <div className="bottomSpacer" />
            </React.Fragment>
          )
        }}
      </Query>
    )
  }
}

export default inject("store")(observer(Dishes))
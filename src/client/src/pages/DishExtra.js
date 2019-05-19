import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Masonry from 'react-masonry-component';
import { Fab } from '@rmwc/fab';
import { LinearProgress } from '@rmwc/linear-progress';
import { observer, inject } from "mobx-react";

import ExtraCard from "../components/extras/ExtraCard";
import ExtraDialog from "../components/extras/ExtraDialog";
class DishExtra extends Component {
  state = {
    openDialog: false
  }
  
  groupBy(xs, func) {
    return xs.reduce(function (rv, x) {
      (rv[func(x)] = rv[func(x)] || []).push(x);
      return rv;
    }, {});
  }

  render(){
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
        pollInterval={5000}>
        {({ data }) => {
          let dishTypes = []
          if (data && data.dishTypes)
            dishTypes = data.dishTypes.map(d => {return {label: d.name, value: d._id}})
          return (
            <React.Fragment>
              <Query
                query = {
                    gql `{
                      dishExtras {
                        _id, 
                        name, 
                        cost, 
                        type {
                          _id,
                          name
                        }
                      }
                    }
                `}
                pollInterval={1000}>
                {({ loading, error, data }) => {
                  if (!data || !data.dishExtras)
                    data = { dishExtras: []}

                  const grouped = this.groupBy(data.dishExtras.filter(o => {
                    return (!filter || matchesFilter.test(o.name) || matchesFilter.test(o.type.name))
                  }), d => d.type.name)

                  const groupedExtras = []
                  for (const group in grouped){
                    groupedExtras.push(<div
                      key={grouped[group][0]._id}
                      style={{
                        width: '-webkit-fill-available',
                        maxWidth: '500px',
                        minWidth: '320px'
                      }}>
                        <ExtraCard typeName={group} extras={grouped[group]} dishTypes={dishTypes} />
                    </div>)
                  }

                  let result = 
                  <React.Fragment>
                    <Masonry id="masonry-layout">
                      {groupedExtras}
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
                < ExtraDialog dishTypes = {
                  dishTypes
                }
                open = {
                  this.state.openDialog
                }
                onClose = {
                  () => this.setState({
                    openDialog: false
                  })
                }/>
            </React.Fragment>
          )}
        }
      </Query>
    )
  }
}
export default inject("store")(observer(DishExtra))
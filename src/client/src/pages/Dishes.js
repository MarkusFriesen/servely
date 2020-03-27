import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Masonry from 'react-masonry-component';
import {Fab} from '@rmwc/fab';

import DishCard from '../components/dishes/DishCard';
import DishDialog from '../components/dishes/DishDialog';
import {LinearProgress} from '@rmwc/linear-progress';
import {observer, inject} from "mobx-react";

const GET_DISH_TYPES = gql`
  query dishTypes {
    dishTypes {
      _id,
      name
    }
  }`

const GET_DISHES = gql`
  query dishes {
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
  }`

const groupBy = (xs, func) => (
  xs.reduce(function (rv, x) {
    (rv[func(x)] = rv[func(x)] || []).push(x);
    return rv;
  }, {})
)

const Dishes = (props) => {
  const [device, setDevice] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const filter = props.store.searchText
  const matchesFilter = new RegExp(filter, "i")

  const dishTypesResult = useQuery(GET_DISH_TYPES, {pollInterval: 10000})
  let dishTypes = []
  if (dishTypesResult.data && dishTypesResult.data.dishTypes)
    dishTypes = dishTypesResult.data.dishTypes.map(d => {return {label: d.name, value: d._id}})

  const {loading, error, data = {dishes: []}} = useQuery(GET_DISHES, {pollInterval: 1000})

  const grouped = groupBy(data.dishes.filter(o => {
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
      <DishCard typeName={group} dishes={grouped[group]} dishTypes={dishTypes} setDevice={setDevice} setIsDialogOpen={setIsDialogOpen} />
    </div>)
  }

  return (
    <>
      {loading ? <LinearProgress /> : <></>}
      {error ? <><p>Error :(</p><span>{error.message}</span></> : <></>}
      <React.Fragment>
        <Masonry id="masonry-layout">
          {groupedDishes}
        </Masonry>
        <Fab className="floating-right" icon="add" onClick={() => {setDevice({}); setIsDialogOpen(true)}} />
      </React.Fragment>
      <DishDialog {...device} dishTypes={dishTypes} open={isDialogOpen} onClose={() => {setDevice({}); setIsDialogOpen(false)}} />
      <div className="bottomSpacer" />
    </>
  )
}

export default inject("store")(observer(Dishes))
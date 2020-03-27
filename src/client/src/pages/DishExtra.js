import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import Masonry from 'react-masonry-component';
import {Fab} from '@rmwc/fab';
import {LinearProgress} from '@rmwc/linear-progress';
import {observer, inject} from "mobx-react";

import ExtraCard from "../components/extras/ExtraCard";
import ExtraDialog from "../components/extras/ExtraDialog";

const GET_DISH_TYPES = gql`
query dishTypes {
  dishTypes {
    _id,
    name
  }
}`

const GET_DISH_EXTRAS = gql`
{
  dishExtras {
    _id, 
    name, 
    cost, 
    type {
      _id,
      name
    }
  }
}`

const groupBy = (xs, func) => (
  xs.reduce((rv, x) => {
    (rv[func(x)] = rv[func(x)] || []).push(x);
    return rv;
  }, {})
)

const openDialog = (setExtra, setOpenDialog) => (extra) => {
  setExtra(extra)
  setOpenDialog(true)
}

const DishExtra = (props) => {
  const [isDialogOpen, setOpenDialog] = useState(false)
  const [extra, setExtra] = useState({})
  const filter = props.store.searchText
  const matchesFilter = new RegExp(filter, "i")

  const dishTypesResult = useQuery(GET_DISH_TYPES, {pollInterval: 10000})
  let dishTypes = []
  if (dishTypesResult.data && dishTypesResult.data.dishTypes)
    dishTypes = dishTypesResult.data.dishTypes.map(d => {return {label: d.name, value: d._id}})

  const {loading, error, data = {dishExtras: []}} = useQuery(GET_DISH_EXTRAS, {pollInterval: 1000})

  const grouped = groupBy(data.dishExtras.filter(o => {
    return (!filter || matchesFilter.test(o.name) || matchesFilter.test(o.type.name))
  }), d => d.type.name)

  const groupedExtras = []
  for (const group in grouped) {
    groupedExtras.push(<div
      key={grouped[group][0]._id}
      style={{
        width: '-webkit-fill-available',
        maxWidth: '500px',
        minWidth: '320px'
      }}>
      <ExtraCard typeName={group} extras={grouped[group]} dishTypes={dishTypes} openDialog={openDialog(setExtra, setOpenDialog)} />
    </div>)
  }

  return (
    <>
      {loading ? <LinearProgress /> : <></>}
      {error ? <><p>Error :(</p><span>{error.message}</span></> : <></>}
      <React.Fragment>
        <Masonry id="masonry-layout">
          {groupedExtras}
        </Masonry>
        <Fab className="floating-right" icon="add" onClick={() => openDialog(setExtra, setOpenDialog)({})} />
      </React.Fragment>
      <ExtraDialog
        {...extra}
        open={isDialogOpen}
        dishTypes={dishTypes}
        onClose={() => setOpenDialog(false)}
      />
    </>
  )
}
export default inject("store")(observer(DishExtra))
import React from 'react'
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {
  Dialog,
  SimpleDialog
} from '@rmwc/dialog';

import JoinDialogSurface from "./JoinDialogSurface"

const GET_ORDERS = 
gql`
  query order($table: Int) {
    orders(table: $table, hasPayed: false) {
      _id,
      name,
    }
  }`

const JoinOrder = (props) => {
  const {loading, error, data = {orders: []}} = useQuery(GET_ORDERS, {variables: {table: props.table}, pollInterval: 500})
  
  if (!loading && !error)
    return(
    <Dialog
        open={props.dialogOpen}
        onClose={props.closeDialog}
    >
        <JoinDialogSurface data={data.orders.filter(o => o._id !== props._id)} {...props}/>
    </Dialog>)
  return (
    <SimpleDialog
      title={`Everyone at table ${props.table}`}
      body={`Fetching Data. ${error ? error.message : ''}`}
      open={props.dialogOpen}
      onClose={props.closeDialog}
    />
  )
}

export default JoinOrder
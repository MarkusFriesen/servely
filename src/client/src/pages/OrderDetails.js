import React from 'react'
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {useHistory, useParams} from 'react-router-dom';

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

const GET_ORDER = gql`
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
  }`

const GET_DISHES = gql`
  {
    dishes {
      _id,
      name,
      type {
        _id,
        name
      }, 
      deselectedExtras {
        _id
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
  }`

const getDetailContent = ({loading, error, data = {orders: []}, dishes, extras, id}) => { 
  if (error) console.error(error)
  return (
    loading ? <LinearProgress /> :
    error ? <><p>Error :( </p><span>{error.message}</span></> 
      : <DetailContent order={data.orders.length === 1 ? data.orders[0] : null } dishes={dishes} extras={extras} id={id}/>)
}

const OrderDetails = (props) => {
  const {id} = useParams()
  const history = useHistory()

  const {loading, error, data} = useQuery(GET_DISHES, {pollInterval: 10000})
  const orderResult = useQuery(GET_ORDER, {variables: {id}})

  let result = 
    loading ? <LinearProgress /> : 
    error ? <><p>Error :( </p><span>{error.message}</span></> 
      : getDetailContent({...orderResult, id, dishes: data.dishes, extras: data.dishExtras})
  return (
    <Elevation className="main-elevation" z={24}>
      <Toolbar>
        <ToolbarRow>
          <ToolbarSection alignStart>
            <ToolbarTitle>Order Details</ToolbarTitle>
          </ToolbarSection>
          <ToolbarSection alignEnd>
            <ToolbarIcon icon="clear" onClick={history.goBack}/>
          </ToolbarSection>
        </ToolbarRow>
      </Toolbar>
      {result}
    </Elevation>
    )
}

export default OrderDetails
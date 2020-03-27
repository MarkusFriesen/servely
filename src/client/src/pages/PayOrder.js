import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {useHistory, useParams} from 'react-router-dom';
import {gql} from 'apollo-boost';
import {Elevation} from '@rmwc/elevation';
import {LinearProgress} from '@rmwc/linear-progress';
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle,
  ToolbarIcon
} from '@rmwc/toolbar';
import PayOrderContent from "../components/orders/PayOrderContent"

const GET_ORDER = gql`
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
        made,
        delivered,
        extras {
          _id,
          cost,
          name
        }
      }
    }
  }`

const getOrderDetails = (id, loading, error, data) => {
  if (loading) return <LinearProgress />;
  if (error) return <><p>Error :(</p><span>{error.message}</span></>;

  if (data.orders.length !== 1) return String()
  return <PayOrderContent
    id={id}
    payedDishes={data.orders[0].dishes.filter(d => d.hasPayed)}
    dishesToPay={data.orders[0].dishes.filter(d => !d.hasPayed)
      .map(d => {
        return {
          dish: d.dish,
          made: d.made,
          paying: true,
          delivered: d.delivered,
          extras: d.extras
        }
      })}
  />
}

const PayOrder = () => {
  const {id} = useParams()
  const {loading, error, data = {orders: []}} = useQuery(GET_ORDER, {variables: {id}, pollInterval: 1000})
  const history = useHistory()
  const name = data.orders[0] && data.orders[0].name ? `${data.orders[0].name}'s` : ''
  return (
    <Elevation className="main-elevation" z={24}>
      <Toolbar className="no-print">
        <ToolbarRow>
          <ToolbarSection alignStart>
            <ToolbarTitle>Pay {name} order</ToolbarTitle>
          </ToolbarSection>
          <ToolbarSection alignEnd>
            <ToolbarIcon icon="clear" onClick={() => history.goBack()} />
          </ToolbarSection>
        </ToolbarRow>
      </Toolbar>
      {getOrderDetails(id, loading, error, data)}          
    </Elevation>
  )
} 

export default PayOrder
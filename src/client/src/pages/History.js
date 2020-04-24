import React, {useState} from 'react'
import {gql} from 'apollo-boost';
import {useQuery} from '@apollo/react-hooks';
import {Elevation} from '@rmwc/elevation';
import {
  Toolbar,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle,
  ToolbarIcon
} from '@rmwc/toolbar';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryText,
  ListItemMeta,
  ListDivider
} from '@rmwc/list';
import {LinearProgress} from '@rmwc/linear-progress';
import {Menu, MenuItem, MenuSurfaceAnchor} from '@rmwc/menu';
import FileSaver from "filesaver.js-npm"
import Pagination from '@material-ui/core/TablePagination'

function getMonday(d) {
  d = new Date(d);
  let day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function downloadData(data, orders, minOrderTimestamp) {
  const blob = new Blob(
    ["\uFEFFid,timestamp,name,type,cost\n",
      ...data.map(o => `${o.id},${o.timestamp.toISOString()},${o.name},${o.type},${o.cost}\n`)], {encoding: "UTF-8", type: "text/csv;charset=UTF-8"})
  FileSaver.saveAs(blob, `Dishes sold ${minOrderTimestamp.toISOString()}-${new Date().toISOString()}.csv`, true)
  const orderBlob = new Blob(
    ["\uFEFFid, timestamp, totalPayed\n",
      ...orders.map(o => `${o._id},${new Date(o.timestamp).toISOString()},${(o.amountPayed || 0).toFixed(2)}\n`)], {encoding: "UTF-8", type: "text/csv;charset=UTF-8"})
  FileSaver.saveAs(orderBlob, `Orders sold ${minOrderTimestamp.toISOString()} -${new Date().toISOString()}.csv`, true)
}

const setHistoryFilter = (setMinOrderTimestamp, setHeader) => evt => {
  let tmsp = new Date("0");
  let title = "History"

  if (evt.detail.index === 1) {
    tmsp = getMonday(new Date(new Date().toDateString()))
    title = "This weeks History"
  } else if (evt.detail.index === 2) {
    tmsp = new Date(new Date().toDateString())
    title = "Todays History"
  }

  setMinOrderTimestamp(tmsp)
  setHeader(title)
}

const ORDERS = gql`query getOrdersInRange($from: String){
  orders(hasPayed: true, fromTimestamp: $from) {
    _id,
    timestamp,
    amountPayed,
    dishes {
      dish {
        name,
        cost,
        type{
          name
        } 
      }
    }
  }
}`

const History = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [minOrderTimestamp, setMinOrderTimestamp] = useState(new Date(new Date().toDateString()))
  const [header, setHeader] = useState("Todays History")
  const [page, setPage] = useState(0)
  const [itemsPerPage] = useState(10)

  const {loading, error, data = {}} = useQuery(ORDERS, {variables: {from: minOrderTimestamp}})

  let ordered = []
  let total = 0
  let totalWithTips = 0
  const {orders = [] } =  data
  orders.forEach(o => {
    o.dishes.forEach(d => {
      ordered.push({
        timestamp: new Date(parseInt(o.timestamp)),
        name: d.dish.name,
        cost: d.dish.cost.toFixed(2),
        type: d.dish.type.name,
        id: o._id
      })
      total = total + d.dish.cost
    })
    totalWithTips = totalWithTips + o.amountPayed || 0
  })


  return (
    <Elevation className="main-elevation" z={24}>
      <Toolbar>
        <ToolbarRow>
          <ToolbarSection alignStart>
            <ToolbarTitle>{header}</ToolbarTitle>
          </ToolbarSection>
          <ToolbarSection alignEnd>
            <MenuSurfaceAnchor>
              <Menu
                open={menuIsOpen}
                onSelect={setHistoryFilter(setMinOrderTimestamp, setHeader)}
                onClose={_ => setMenuIsOpen(false)}
              >
                <MenuItem>Everything</MenuItem>
                <MenuItem>This Week</MenuItem>
                <MenuItem>Today</MenuItem>
              </Menu>

              <ToolbarIcon icon="filter_list"
                onClick={_ => setMenuIsOpen(!menuIsOpen)}
              />
            </MenuSurfaceAnchor>
            <ToolbarIcon icon="cloud_download" onClick={() => downloadData(ordered, orders, minOrderTimestamp)} />
          </ToolbarSection>
        </ToolbarRow>
      </Toolbar>
      <List>{
        ordered.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage).map((o, i) =>
          <ListItem key={i} >
            <ListItemText>{o.name}
              <ListItemSecondaryText> {o.timestamp.toDateString()} </ListItemSecondaryText>
            </ListItemText>
            <ListItemMeta tag="span" basename="" >{`€ ${o.cost}`}</ListItemMeta>
          </ListItem>
        )}

        {
          !loading && !error && ordered.length === 0 ? 
          <ListItem >
            <ListItemText> Nothing was found
            </ListItemText>
          </ListItem> : <></>
        }

        <ListDivider />
        
        {loading ? <LinearProgress /> : <></>}
        {error ? <><p>Error :(</p><span>{error.message}</span></> : <></>}
        <ListItem>
          <ListItemText>Total
            <ListItemSecondaryText>with tip: {`€ ${totalWithTips.toFixed(2)}`} </ListItemSecondaryText>
          </ListItemText>
          <ListItemMeta tag="span" basename="" >{`€ ${total.toFixed(2)}`}</ListItemMeta>
        </ListItem>

        <ListDivider />
      </List>

      <table style={{width: '100%'}}>
        <tbody>
          <tr>
            <Pagination rowsPerPageOptions={[]} count={ordered.length} rowsPerPage={itemsPerPage} page={page} onChangePage={(_, newPage) => setPage(newPage)} />
          </tr>
        </tbody>
      </table>
    </Elevation>
  )
}

export default History
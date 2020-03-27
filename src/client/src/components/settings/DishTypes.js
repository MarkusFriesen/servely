import React, {useState} from 'react'
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {LinearProgress} from '@rmwc/linear-progress';
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
  ListItemMeta
} from '@rmwc/list';
import DishTypeDialog from './DishTypeDialog';

const GET_DISH_TYPES = gql`
query dishTypes {
  dishTypes {
    _id,
    name
  }
}`

const DishTypes = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({_id: null})

  const {loading, error, data = {dishTypes: []}} = useQuery(GET_DISH_TYPES, {pollInterval: 1000})
  return (
    <React.Fragment>
      <Toolbar>
        <ToolbarRow>
          <ToolbarSection alignStart>
            <ToolbarTitle>Dish types</ToolbarTitle>
          </ToolbarSection>
          <ToolbarSection alignEnd>
            <ToolbarIcon icon="add" onClick={() => {setDialogContent({_id: null});setIsDialogOpen(!isDialogOpen)}} />
          </ToolbarSection>
        </ToolbarRow>
      </Toolbar>
      {loading ? <LinearProgress /> : <></>}
      {error ? <><p>Error :(</p><span>{error.message}</span></> : <></>}
      <List>{
        data.dishTypes.map(d =>
          <ListItem key={d._id} onClick={() => {setDialogContent(d); setIsDialogOpen(!isDialogOpen); }}>
            <ListItemText>{d.name}</ListItemText>
            <ListItemMeta icon="edit" />
          </ListItem>
        )}
      </List>
      <DishTypeDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} {...dialogContent} />
    </React.Fragment>
  )
}

export default DishTypes
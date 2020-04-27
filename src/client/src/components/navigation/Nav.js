import React, {useState} from 'react'
import {inject, observer} from 'mobx-react'
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarActionItem,
  TopAppBarTitle,
  TopAppBarNavigationIcon
} from '@rmwc/top-app-bar'
import {
  List,
  ListItemGraphic,
  ListItem,
  ListItemText
} from '@rmwc/list'
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle
} from '@rmwc/drawer'
import {
  Link
} from 'react-router-dom'
import './Nav.css'

const handleSearchText = (props, setSearchText) => (e) => {
  setSearchText(e.target.value)
  props.store.searchText = e.target.value
}

function toggleSearch(props, setSearchText, searching, setSearching) {
  setSearching(!searching)
  setSearchText('')
  props.store.searchText = ''
}

const closeModal = (setIsModalOpen) => () => {
  setIsModalOpen(false)
}
const Nav = (props) => {

  const [searching, setSearching] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  if (searching)
    return (
      <TopAppBar dense fixed>
        <TopAppBarRow>
          <TopAppBarSection className="search-field" alignStart>
            <input placeholder="Search" autoFocus value={searchText} onChange={handleSearchText(props, setSearchText)} />
            <TopAppBarActionItem aria-label="Search" icon="clear" alt="Search this Page" onClick={() => toggleSearch(props, setSearchText, searching, setSearching)} />
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>
    )

  return (
    <React.Fragment>
      <TopAppBar dense fixed className="no-print">
        <TopAppBarRow>
          <TopAppBarSection alignStart>
            <TopAppBarNavigationIcon icon="menu" onClick={() => setIsModalOpen(true)} />
            <TopAppBarTitle>{props.store.kitchenMode ? "Servely's Kitchen" : "Servely"}</TopAppBarTitle>
          </TopAppBarSection>
          <TopAppBarSection alignEnd>
            <TopAppBarActionItem aria-label="Search" icon="search" alt="Search this Page" onClick={() => toggleSearch(props, setSearchText, searching, setSearching)} />
          </TopAppBarSection>
        </TopAppBarRow>
      </TopAppBar>

      <Drawer
        modal
        open={isModalOpen}
        onClose={closeModal(setIsModalOpen)}
      >
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <List>
            <Link to="/orders">
              <ListItem onClick={closeModal(setIsModalOpen)}>
                <ListItemGraphic icon="shopping_cart" />
                <ListItemText>Orders</ListItemText>
              </ListItem>
            </Link>
            <Link to="/orderHistory">
              <ListItem onClick={closeModal(setIsModalOpen)}>
                <ListItemGraphic icon="history" />
                <ListItemText>History</ListItemText>
              </ListItem>
            </Link>
            <Link to="/dishes">
              <ListItem onClick={closeModal(setIsModalOpen)}>
                <ListItemGraphic icon="shopping_basket" />
                <ListItemText>Dishes</ListItemText>
              </ListItem>
            </Link>
            <Link to="/dishExtra">
              <ListItem onClick={closeModal(setIsModalOpen)}>
                <ListItemGraphic icon="loyalty" />
                <ListItemText>Extras</ListItemText>
              </ListItem>
            </Link>
            <Link to="/settings">
              <ListItem onClick={closeModal(setIsModalOpen)}>
                <ListItemGraphic icon="settings" />
                <ListItemText>Settings</ListItemText>
              </ListItem>
            </Link>
          </List>
        </DrawerContent>
      </Drawer>
    </React.Fragment>
  )
}

export default inject("store")(observer(Nav))
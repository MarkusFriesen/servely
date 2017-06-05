import React from "react";
import { inject } from "mobx-react"
import { Header, Textfield } from 'react-mdl';

@inject("orderStore")
@inject("dishStore")
@inject("dishTypeStore")
export default class Nav extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      filter: ""
    }
  }
  handleSearch(e){
    this.setState({
      filter: e.target.value
    })
    this.props.orderStore.filter = e.target.value
    this.props.dishStore.filter = e.target.value
    this.props.dishTypeStore.filter = e.target.value
  }

  render() {
    const handleSearch = this.handleSearch.bind(this)
    return (
      <Header title={<span><strong>Order</strong></span>}>
      <Textfield
                value={ this.state.filter }
                onChange={handleSearch}
                label="Search"
                expandable
                expandableIcon="search"
            />
      </Header>
    )
  }
}
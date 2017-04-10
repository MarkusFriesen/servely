import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col, Label, Input } from 'reactstrap';
import classnames from 'classnames';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      kitchenMode: true
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleKitchenMode(){
    this.setState({
      kitchenMode: !this.state.kitchenMode
    })
  }
  render() {
    return (
      <div class="settings">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Orders
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Dishes
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Label check>
                <Input type="checkbox" onClick={this.toggleKitchenMode.bind(this)} checked={this.state.kitchenMode}/>{' '} Kitchen mode
              </Label>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <h4>Create your dish types here</h4>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

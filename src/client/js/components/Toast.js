import React from "react";
import { Alert } from "reactstrap"

export default class Toast extends React.Component {
  constructor(){
    super();
    this.state = {
      show: false
    };

    this.toggle = this.toggle.bind(this)
  }

  componentWillReceiveProps(nextProps){
    if (nextProps && nextProps.message){
      this.setState({
        show: true
      })

      setTimeout(() =>
        this.setState({
            show: false
          }), 4000)
    }
  }

  toggle(){
    this.setState({ show: !this.state.show })
  }

  render() {
    const title = this.props.title;
    const message = this.props.message;

    return (
      <Alert color="danger toast" isOpen={ this.state.show } transitionEnterTimeout={700} transitionLeaveTimeout={500}>
        <strong>{ title }</strong> { message }
      </Alert>
      );
  }
}

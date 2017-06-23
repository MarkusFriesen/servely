import React from 'react'
import { Snackbar } from 'react-mdl';

export default class UndoSnackbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
    this.undoAction = this.undoAction.bind(this);
    this.state = { isSnackbarActive: false };
  }

  componentDidMount(){
    if (this.props.text){
      this.handleShowSnackbar()
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.text && this.props.text !== nextProps.text){
      this.handleShowSnackbar()
    }
  }

  undoAction(){
     if (this.props.undoAction){
      this.props.undoAction()
     }
      
    this.handleTimeoutSnackbar()
  }

  handleShowSnackbar(){
    this.setState({
      isSnackbarActive: true
    })
  }

  handleTimeoutSnackbar(){
    this.setState({
      isSnackbarActive: false
    })

    this.props.clear()
  }

  render(){
    return(
      <Snackbar 
        active={this.state.isSnackbarActive}
        onClick={this.undoAction}
        onTimeout={this.handleTimeoutSnackbar}
        action="Undo">{this.props.text}</Snackbar>)
  }
}
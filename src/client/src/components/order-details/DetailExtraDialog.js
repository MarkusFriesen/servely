import React, { Component } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogButton
} from '@rmwc/dialog'
import { List, SimpleListItem } from '@rmwc/list'
import { Chip, ChipSet } from '@rmwc/chip';

export default class DetailExtraDialog extends Component {
  constructor(props){
    super(props)
    this.state = { selectedExtras: [] }
  }

  componentWillReceiveProps(newProps, oldProps) {
    if (JSON.stringify(newProps.selectedExtras) !== JSON.stringify(oldProps.selectedExtras)) {
      this.setState({
        selectedExtras: newProps.selectedExtras
      })
    }
  }
  
  onDelete = () => {
    this.setState({ selectedExtras: []})
    this.props.onDelete()
  }

  onSave = () => {
    this.props.onSave(this.state.selectedExtras.map(e => Object.create(e)))
    this.setState({ selectedExtras: []})
  }

  addExtra = (e) => {
    const { selectedExtras } = this.state
    selectedExtras.push(e)
    this.setState({selectedExtras: selectedExtras})
  }
  render() {
    const {dish, extras} = this.props;
    let title = extras ? `Edit ${dish? dish.name : "dish"}` : `Confirm ${dish? dish.name : "dish"} Deletion`;

    return(
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <DialogTitle>{title}</DialogTitle>

        { extras ? 
          < DialogContent >
            <ChipSet>
              {extras.map(e => <Chip key={e._id} label={e.name} onClick={() => this.addExtra(e)}/>)}
            </ChipSet>

            <List>
              {this.state.selectedExtras.map((s, id)=> 
              <SimpleListItem
                key={id}
                graphic="close"
                text={s.name}
                onClick={() => {
                  this.state.selectedExtras.splice(id, 1) 
                  this.setState({
                    selectedExtras: this.state.selectedExtras
                  })
                  }}
              />)}
            </List>
          </DialogContent> : 
          <React.Fragment/>}
        <DialogActions>
          <DialogButton 
            theme="secondary" 
            action="close" 
            isDefaultAction 
            onClick={this.onDelete}>Delete</DialogButton>
          <DialogButton 
            theme="primary" 
            action="accept"
            onClick = {this.onSave} > 
              {
                extras ? "Save" : "Cancel"
            } </DialogButton>
        </DialogActions>
      </Dialog>
    )
  }
}
import React, {useState, useEffect} from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogButton
} from '@rmwc/dialog'
import {List, SimpleListItem} from '@rmwc/list'
import {Chip, ChipSet} from '@rmwc/chip';

const onDelete = (setSelectedExtras, onDelete) => () => {
  setSelectedExtras([])
  onDelete()
}

const onCancel = (setSelectedExtras, onClose) => () => {
  setSelectedExtras([])
  onClose()
}

const onSave = (setSelectedExtras, selectedExtras, onSave) => () => {
  onSave(selectedExtras.map(e => ({...e})))
  setSelectedExtras([])
}

const addExtra = (selectedExtras, setSelectedExtras, e) => () => {
  setSelectedExtras([e].concat(selectedExtras))
}

const DetailExtraDialog = (props) => {
  const [selectedExtras, setSelectedExtras] = useState([])

  useEffect(() => {
    setSelectedExtras(props.selectedExtras || [])
  }, [props.selectedExtras])

  const {dish, extras} = props;
  const anyExtras = extras && extras.length > 0
  let title = anyExtras ? `Edit ${dish ? dish.name : "dish"} extras` : `Confirm ${dish ? dish.name : "dish"} Deletion`;

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>{title}</DialogTitle>

      {anyExtras ?
        < DialogContent >
          <ChipSet>
            {extras.sort((a, b) => a.name < b.name ? -1 : 1)
              .map(e => <Chip key={e._id} label={e.name} onClick={addExtra(selectedExtras, setSelectedExtras, e)} />)}
          </ChipSet>

          <List>
            {selectedExtras.map((s, id) =>
              <SimpleListItem
                key={id}
                graphic="close"
                text={s.name}
                onClick={() => setSelectedExtras(selectedExtras.filter((d, idx) => idx !== id))}
              />)}
          </List>
        </DialogContent> :
        <React.Fragment />}
      <DialogActions>
        <DialogButton
          theme="secondary"
          action="close"
          onClick={onDelete(setSelectedExtras, props.onDelete)}>Delete</DialogButton>
        <DialogButton
          theme="primary"
          action="close"
          isDefaultAction
          onClick={onCancel(setSelectedExtras, props.onClose)}>Cancel</DialogButton>
        {
          anyExtras ? < DialogButton
            theme="primary"
            action="accept"
            onClick={onSave(setSelectedExtras, selectedExtras, props.onSave)} >Save</DialogButton> : <React.Fragment />}
      </DialogActions>
    </Dialog>
  )
}

export default DetailExtraDialog
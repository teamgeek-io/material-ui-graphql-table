import React from "react"

import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

interface Props {
  title?: string
  message: string
  onConfirm(): Promise<any> | void
  open?: boolean
  onClose: () => void
}

const ConfirmationDialog: React.FC<Props> = ({
  title,
  message,
  onConfirm,
  open = false,
  onClose,
}: Props) => {
  return (
    <Dialog
      open={open}
      aria-labelledby="confirmation-dialog-title"
      onClose={onClose}
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onConfirm}>
          Yes
        </Button>
        {onClose ? (
          <Button color="secondary" onClick={onClose}>
            No
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog

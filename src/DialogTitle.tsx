import React, { ReactNode } from "react"

import MuiDialogTitle from "@material-ui/core/DialogTitle"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"
import CloseIcon from "@material-ui/icons/Close"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

interface Props {
  children: ReactNode
  onClose: () => void
  [name: string]: any
}

const DialogTitle: React.FC<Props> = ({ children, onClose }: Props) => {
  const classes = useStyles()
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
}

export default DialogTitle

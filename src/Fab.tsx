import React from "react"

import MuiFab from "@material-ui/core/Fab"
import Tooltip from "@material-ui/core/Tooltip"
import makeStyles from "@material-ui/core/styles/makeStyles"
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from "@material-ui/icons/Delete"

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}))

type FabAction = "add" | "delete"

interface Props {
  action: FabAction
  onClick(action: FabAction): void
}

const Fab: React.FC<Props> = ({ action, onClick, ...props }: Props) => {
  const classes = useStyles()

  const handleClick = (): void => {
    onClick(action)
  }

  if (action == "add") {
    return (
      <Tooltip title="Add" aria-label="Add">
        <MuiFab
          className={classes.fab}
          color="primary"
          aria-label="Add"
          onClick={onClick && handleClick}
          {...props}
        >
          <AddIcon />
        </MuiFab>
      </Tooltip>
    )
  } else {
    return (
      <Tooltip title="Delete" aria-label="Delete">
        <MuiFab
          className={classes.fab}
          color="secondary"
          aria-label="Delete"
          onClick={onClick && handleClick}
          {...props}
        >
          <DeleteIcon />
        </MuiFab>
      </Tooltip>
    )
  }
}

export default Fab

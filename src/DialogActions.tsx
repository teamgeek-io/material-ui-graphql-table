import MuiDialogActions from "@material-ui/core/DialogActions"
import { withStyles } from "@material-ui/core/styles"

const DialogActions = withStyles((theme) => ({
  root: {
    minHeight: theme.spacing(8),
  },
}))(MuiDialogActions)

export default DialogActions

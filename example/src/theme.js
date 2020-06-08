import { red } from "@material-ui/core/colors"
import { createMuiTheme } from "@material-ui/core/styles"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#EFAE0B",
    },
    secondary: {
      main: "#fff",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#424242",
    },
    type: "dark",
  },
})

export default theme

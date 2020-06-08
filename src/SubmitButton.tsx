import React from "react"

import { makeStyles } from "@material-ui/core/styles"

import Button, { Props as ButtonProps } from "./Button"

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(3, 0, 2),
  },
}))

interface Props extends ButtonProps {
  [name: string]: any
}

const SubmitButton: React.FC<Props> = (props: Props) => {
  const classes = useStyles()
  return <Button type="submit" rootClassName={classes.button} {...props} />
}

export default SubmitButton

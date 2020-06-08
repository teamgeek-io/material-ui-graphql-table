import clsx from "clsx"
import React, { ReactNode } from "react"

import MuiButton, { ButtonProps } from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    position: "relative",
  },
  fullWidth: {
    width: "100%",
  },
  buttonProgress: {
    // @ts-ignore
    color: theme.palette.primary,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}))

export interface Props extends ButtonProps {
  children?: ReactNode
  rootClassName?: string
  wrapperClassName?: string
  loading?: boolean
}

const Button: React.FC<Props> = ({
  children,
  rootClassName,
  wrapperClassName,
  loading = false,
  fullWidth = false,
  ...props
}: Props) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, rootClassName)}>
      <div
        className={clsx(
          classes.wrapper,
          {
            [classes.fullWidth]: fullWidth,
          },
          wrapperClassName,
        )}
      >
        <MuiButton fullWidth={fullWidth} {...props}>
          {children}
        </MuiButton>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </div>
  )
}

export default Button

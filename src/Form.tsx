import clsx from "clsx"
import { Form as FormikForm } from "formik"
import React from "react"

import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  form: {
    width: "100%", // Fix IE 11 issue.
  },
})

interface Props {
  className?: string
  [name: string]: any
}

const Form: React.FC<Props> = ({ className, ...props }: Props) => {
  const classes = useStyles()
  return <FormikForm className={clsx(classes.form, className)} {...props} />
}

export default Form

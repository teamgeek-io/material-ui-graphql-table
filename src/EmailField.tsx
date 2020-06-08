import React from "react"

import TextField from "./TextField"

const normalize = (value: string): string => value.trim().toLowerCase()

interface Props {
  field: any
  form: any
  [name: string]: any
}

const EmailField: React.FC<Props> = (props: Props) => {
  return <TextField autoComplete="email" normalize={normalize} {...props} />
}

export default EmailField

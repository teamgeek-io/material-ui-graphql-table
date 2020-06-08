import React from "react"

import TextField from "./TextField"

interface Props {
  field: any
  form: any
  [name: string]: any
}

const PasswordField: React.FC<Props> = (props: Props) => {
  return (
    <TextField type="password" autoComplete="current-password" {...props} />
  )
}

export default PasswordField

import React from "react"

import MuiTextField from "@material-ui/core/TextField"

// TODO: Figure out how to type the Formik props
interface Props {
  field: any
  form: any
  normalize?: (value: string) => string
  [name: string]: any
}

const identity = (value: string): string => value

const TextField: React.FC<Props> = ({
  field,
  form,
  normalize = identity,
  ...props
}: Props) => {
  const error = form.errors[field.name] && form.touched[field.name]

  const handleBlur = (): void => {
    form.setFieldTouched(field.name, true)
  }

  const handleChange = (event: any): void => {
    const value = normalize(event.target.value)
    form.setFieldValue(field.name, value)
  }

  return (
    <MuiTextField
      error={error}
      fullWidth
      helperText={error ? form.errors[field.name] : ""}
      margin="normal"
      onBlur={handleBlur}
      onChange={handleChange}
      value={field.value}
      variant="outlined"
      {...props}
    />
  )
}

export default TextField

import React from "react"

import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"

interface Props {
  field: any
  form: any
  label: string
}

const SwitchField: React.FC<Props> = ({
  field,
  form,
  label,
  ...props
}: Props) => {
  const handleChange = (event: any): void => {
    form.setFieldValue(field.name, event.target.checked)
  }

  return (
    <FormControlLabel
      control={
        <Switch
          checked={!!field.value}
          onChange={handleChange}
          value={field.name}
          {...props}
        />
      }
      label={label}
    />
  )
}

export default SwitchField

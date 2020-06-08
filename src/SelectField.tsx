import React, { useEffect, useRef, useState } from "react"

import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import Select from "@material-ui/core/Select"
import { SelectInputProps } from "@material-ui/core/Select/SelectInput"

type Option = {
  value: any
  label: string
}

interface Props extends SelectInputProps {
  field: any
  form: any
  label: string
  options: Option[]
  empty: boolean
  normalize(value: any): any
}

const SelectField: React.FC<Props> = ({
  options,
  field,
  form,
  label,
  empty,
  normalize = (v): any => v,
  ...props
}: Props) => {
  const error = form.errors[field.name] && form.touched[field.name]

  const inputLabel = useRef<HTMLLabelElement>(null)
  const [labelWidth, setLabelWidth] = useState(0)

  useEffect(() => {
    if (inputLabel.current) {
      setLabelWidth(inputLabel.current.offsetWidth)
    }
  }, [])

  const handleBlur = (): void => {
    form.setFieldTouched(field.name, true)
  }

  const handleChange = (event: any): void => {
    const value = normalize(event.target.value)
    form.setFieldValue(field.name, value)
  }

  return (
    <FormControl variant="outlined" fullWidth margin="normal">
      <InputLabel ref={inputLabel} htmlFor={field.name}>
        {label}
      </InputLabel>
      <Select
        error={error}
        onBlur={handleBlur}
        onChange={handleChange}
        value={field.value}
        input={
          <OutlinedInput
            labelWidth={labelWidth}
            name={field.name}
            id={field.name}
          />
        }
        {...props}
      >
        {empty && (
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
        )}
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
      {error && (
        <FormHelperText error={error}>{form.errors[field.name]}</FormHelperText>
      )}
    </FormControl>
  )
}

export default SelectField

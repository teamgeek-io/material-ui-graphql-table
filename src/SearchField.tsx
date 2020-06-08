import _ from "lodash"
import React from "react"

import InputAdornment from "@material-ui/core/InputAdornment"
import TextField, { StandardTextFieldProps } from "@material-ui/core/TextField"
import SearchIcon from "@material-ui/icons/Search"

interface Props extends StandardTextFieldProps {
  value?: string
  onSearchValueChange?(value: string): void
  debounceWait?: number
  onSearch?(value: string): void
}

const SearchField: React.FC<Props> = ({
  value = "",
  onSearchValueChange,
  debounceWait = 500,
  onSearch,
  ...props
}: Props) => {
  let search: (value: string) => void
  if (typeof onSearch === "function") {
    search = _.debounce(onSearch, debounceWait)
  }

  const handleChange = (event: any): void => {
    const { value } = event.target

    if (typeof onSearchValueChange === "function") {
      onSearchValueChange(value)
    }

    if (typeof search === "function") {
      search(value)
    }
  }

  return (
    <TextField
      variant="outlined"
      placeholder="Search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      value={value}
      onChange={handleChange}
      {...props}
    />
  )
}

export default SearchField

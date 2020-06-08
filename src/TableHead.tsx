import clsx from "clsx"
import humps from "humps"
import _ from "lodash"
import React from "react"

import Checkbox from "@material-ui/core/Checkbox"
import TableCell from "@material-ui/core/TableCell"
import MuiTableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import makeStyles from "@material-ui/core/styles/makeStyles"
import SortAscIcon from "@material-ui/icons/ArrowDropDown"
import SortDescIcon from "@material-ui/icons/ArrowDropUp"

import type { Action, Field } from "."

const useStyles = makeStyles({
  pointer: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  container: {
    display: "flex",
    "align-items": "center",
  },
})

const sortAsc = (fieldName: string): string =>
  `${humps.decamelize(fieldName)}_asc`.toUpperCase()
const sortDesc = (fieldName: string): string =>
  `${humps.decamelize(fieldName)}_desc`.toUpperCase()

interface Props {
  fields: Field[]
  sort?: string
  onSortChange?(sortValue: string): void
  selectedObjects?: { [key: string]: any }[]
  selectionDisabled?: boolean
  onToggleSelection?: () => void
  actionsHidden?: boolean
  actions?: Action[]
}

const TableHead: React.FC<Props> = ({
  fields,
  sort,
  onSortChange,
  selectedObjects = [],
  selectionDisabled = false,
  onToggleSelection,
  actionsHidden = true,
  actions = [],
}: Props) => {
  const classes = useStyles()

  const sortEnabled = Boolean(onSortChange)

  const handleLabelClick = (field: Field): (() => void) => {
    return (): void => {
      const sortKey = field.sortKey || field.name
      let newSort
      if (sort == sortAsc(sortKey)) {
        newSort = sortDesc(sortKey)
      } else {
        newSort = sortAsc(sortKey)
      }
      if (typeof onSortChange === "function") {
        onSortChange(newSort)
      }
    }
  }

  const renderSortIcon = (field: Field): React.ReactNode => {
    const sortKey = field.sortKey || field.name
    if (sort == sortAsc(sortKey)) {
      return <SortAscIcon />
    } else if (sort == sortDesc(sortKey)) {
      return <SortDescIcon />
    } else {
      return null
    }
  }

  const cells = fields.map((field) => {
    if (field.hidden) return null
    const sortable = field.sortable === undefined ? true : field.sortable
    return (
      <TableCell
        className={clsx(sortEnabled && sortable && classes.pointer)}
        key={field.name}
        onClick={sortEnabled && sortable ? handleLabelClick(field) : undefined}
      >
        <div className={classes.container}>
          {field.label || field.name}
          {sortEnabled && renderSortIcon(field)}
        </div>
      </TableCell>
    )
  })

  const actionCells = []
  if (!actionsHidden) {
    actionCells.push(
      <TableCell key={-1} padding="checkbox">
        &nbsp;
      </TableCell>,
    )
  }
  _.times(actions.length, (key) => {
    actionCells.push(
      <TableCell key={key} padding="checkbox">
        &nbsp;
      </TableCell>,
    )
  })

  return (
    <MuiTableHead>
      <TableRow>
        {onToggleSelection && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedObjects.length > 0}
              onChange={onToggleSelection}
              disabled={selectionDisabled}
            />
          </TableCell>
        )}
        {cells}
        {actionCells}
      </TableRow>
    </MuiTableHead>
  )
}

export default TableHead

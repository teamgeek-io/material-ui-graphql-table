import clsx from "clsx"
import _ from "lodash"
import React from "react"
import type { ReactNode } from "react"

import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import IconButton from "@material-ui/core/IconButton"
import TableCell from "@material-ui/core/TableCell"
import MuiTableRow from "@material-ui/core/TableRow"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"
import EditIcon from "@material-ui/icons/Edit"
import ViewIcon from "@material-ui/icons/Visibility"

import { formatValue } from "./utils"
import type { Action, Field } from "."
import { Chip } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  deleting: {
    color: theme.palette.action.disabled,
    textDecoration: "line-through",
  },
  list: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}))

interface Props {
  data: { [key: string]: any }
  fields: Field[]
  selected?: boolean
  onSelect?(selected: { [key: string]: any }): void
  onEdit?(editing: { [key: string]: any }): void
  editable?: boolean
  deleting?: boolean
  actions?: Action[]
}

interface RenderButtonType extends Action {
  disabled?: boolean
}

const TableRow: React.FC<Props> = ({
  data,
  fields,
  selected,
  onSelect,
  onEdit,
  editable,
  deleting,
  actions,
}: Props) => {
  const classes = useStyles()

  const handleCheckboxChange = (): void => {
    if (typeof onSelect === "function") {
      onSelect(data)
    }
  }

  const handleEditClick = (): void => {
    if (typeof onEdit === "function") {
      onEdit(data)
    }
  }

  const renderValue = (field: Field): string => {
    const value = _.get(data, field.name)
    return formatValue(field, value)
  }

  const renderContent = (field: Field): ReactNode => {
    if (field.type === "autocompletelist" && field.options) {
      const labelPath = _.get(field.options, "labelPath")
      const value = _.get(data, field.name)
      return (
        <div className={classes.list}>
          {value.edges.map(({ node }: { node: any }) => (
            <Chip key={node.id} label={_.get(node, labelPath)} />
          ))}
        </div>
      )
    } else {
      return (
        <Typography
          className={clsx(deleting && classes.deleting)}
          variant="body2"
        >
          {renderValue(field)}
        </Typography>
      )
    }
  }

  const renderFields = (): React.ReactNode => {
    return fields.map(
      (field) =>
        !field.hidden && (
          <TableCell key={`${data.id}-${field.name}`}>
            {renderContent(field)}
          </TableCell>
        ),
    )
  }

  const renderButton = ({
    title,
    onAction,
    icon,
    disabled,
  }: RenderButtonType): React.ReactNode => {
    if (deleting) return null

    let iconEl
    if (React.isValidElement(icon)) {
      iconEl = icon
    } else if (_.isFunction(icon)) {
      iconEl = icon(data)
    }

    let isDisabled = disabled
    if (_.isFunction(disabled)) {
      isDisabled = disabled(data)
    }

    if (iconEl) {
      return (
        <Tooltip title={title} aria-label={title}>
          <IconButton
            color="primary"
            onClick={(): void => onAction(data)}
            disabled={isDisabled}
          >
            {iconEl}
          </IconButton>
        </Tooltip>
      )
    } else {
      return (
        <Tooltip title={title} aria-label={title}>
          <Button
            color="primary"
            onClick={(): void => onAction(data)}
            disabled={isDisabled}
          >
            {title}
          </Button>
        </Tooltip>
      )
    }
  }

  const renderActions = (): React.ReactNode => {
    return _.map(actions, (action) => {
      return (
        <TableCell key={action.title} padding="checkbox">
          {renderButton(action)}
        </TableCell>
      )
    })
  }

  return (
    <MuiTableRow selected={selected}>
      {onSelect ? (
        <TableCell padding="checkbox">
          {deleting ? null : (
            <Checkbox checked={selected} onChange={handleCheckboxChange} />
          )}
        </TableCell>
      ) : null}
      {renderFields()}
      {onEdit ? (
        <TableCell padding="checkbox">
          {deleting ? null : (
            <Tooltip
              title={editable ? "Edit" : "View"}
              aria-label={editable ? "Edit" : "View"}
            >
              <IconButton color="primary" onClick={handleEditClick}>
                {editable ? <EditIcon /> : <ViewIcon />}
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      ) : null}
      {renderActions()}
    </MuiTableRow>
  )
}

export default TableRow

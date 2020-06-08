import clsx from "clsx"
import _ from "lodash"
import React, { useCallback } from "react"

import Grid from "@material-ui/core/Grid"
import LinearProgress from "@material-ui/core/LinearProgress"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"

import TableHead from "./TableHead"
import TableRow from "./TableRow"
import VisibilityTrigger from "./VisibilityTrigger"
import type { Action, Field } from "."

interface GenericDictionary {
  [key: string]: any
}

const useStyles = makeStyles((theme) => ({
  message: {
    marginTop: theme.spacing(2),
  },
  error: {
    color: theme.palette.error.main,
  },
}))

interface Props {
  result: GenericDictionary
  connectionName: string
  fields: Field[]
  sort?: string
  onSortChange?: (sortValue: string) => void
  selectedObjects?: GenericDictionary[]
  objectsDeleting?: GenericDictionary[]
  onSelect?(values: GenericDictionary): void
  onToggleSelection?: () => void
  onEdit?: (object: any) => void
  editable?: boolean
  actions?: Action[]
}

const ResultTable: React.FC<Props> = ({
  result,
  connectionName,
  fields,
  sort,
  onSortChange,
  selectedObjects = [],
  objectsDeleting = [],
  onSelect,
  onToggleSelection,
  onEdit,
  editable = false,
  actions,
}: Props) => {
  const classes = useStyles()

  const fetching = result.networkStatus < 7
  const fetchingMore = result.networkStatus === 3

  const connection = _.get(result.data, connectionName, {})
  const { edges = [], pageInfo = {} } = connection

  const fetchMore = useCallback(() => {
    const cursor = _.get(connection, "pageInfo.endCursor")
    result.fetchMore({
      variables: {
        cursor,
      },
      updateQuery: (
        previousResult: any,
        { fetchMoreResult }: { fetchMoreResult: any },
      ) => {
        const newConnection = _.get(fetchMoreResult, connectionName)
        const { edges: newEdges = [], pageInfo } = newConnection
        if (newEdges.length === 0) {
          return previousResult
        }

        const previousConnection = _.get(previousResult, connectionName)
        const result = {
          __typename: previousConnection.__typename,
          edges: [...previousConnection.edges, ...newEdges],
          pageInfo,
        }

        return _.set({}, connectionName, result)
      },
    })
  }, [connection, connectionName, result])

  const renderRows = (): React.ReactNode => {
    return edges.map(({ node }: { node: any }) => {
      const selected = Boolean(_.find(selectedObjects, { id: node.id }))
      const deleting = Boolean(_.find(objectsDeleting, { id: node.id }))
      return (
        <TableRow
          key={node.id}
          data={node}
          fields={fields}
          selected={selected}
          onSelect={onSelect}
          onEdit={onEdit}
          editable={editable}
          deleting={deleting}
          actions={actions}
        />
      )
    })
  }

  return (
    <>
      <Table>
        <TableHead
          fields={fields}
          sort={sort}
          onSortChange={onSortChange}
          selectedObjects={selectedObjects}
          selectionDisabled={fetching}
          onToggleSelection={onToggleSelection}
          actionsHidden={!onEdit}
          actions={actions}
        />
        <TableBody>{renderRows()}</TableBody>
      </Table>
      {!fetching && result.error && (
        <Grid container justify="center">
          <Grid item>
            <Typography
              className={clsx([classes.message, classes.error])}
              variant="body1"
            >
              {String(result.error)}
            </Typography>
          </Grid>
        </Grid>
      )}
      {!fetching && edges.length == 0 && (
        <Grid container justify="center">
          <Grid item>
            <Typography className={classes.message} variant="body2">
              No results!
            </Typography>
          </Grid>
        </Grid>
      )}
      {fetchingMore && <LinearProgress />}
      {!fetching && pageInfo.hasNextPage && (
        <VisibilityTrigger onVisible={fetchMore} />
      )}
    </>
  )
}

export default ResultTable

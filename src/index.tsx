import _ from "lodash"
import pluralize from "pluralize"
import React, { useEffect, useMemo, useState } from "react"
import type { ElementType, ReactNode } from "react"
import { Mutation } from "react-apollo"

import { useQuery } from "@apollo/react-hooks"
import CircularProgress from "@material-ui/core/CircularProgress"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"

import ConfirmationDialog from "./ConfirmationDialog"
import Fab from "./Fab"
import FormDialog from "./FormDialog"
import ResultTable from "./ResultTable"
import SearchField from "./SearchField"
import type { DocumentNode } from "apollo-boost"

const noop = (...args: any[]): any => {
  console.warn(...args)
}

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  searchField: {
    marginLeft: theme.spacing(2),
  },
  tableCellHead: {
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
    lineHeight: "1.3125rem",
    fontWeight: 500,
  },
}))

interface GenericDictionary {
  [key: string]: any
}

export interface Action {
  title: string
  onAction: (data: any) => void
  icon: ElementType | ReactNode | (() => void)
}

interface Option {
  label: string
  value: any
}

type FieldType =
  | "autocomplete"
  | "datetime"
  | "select"
  | "switch"
  | "editor"
  | "autocompletelist"

export interface AutocompleteProps {
  connectionName: string
  labelPath?: string
  query: DocumentNode
  valuePath?: string
  saveArg?: string
}

export interface Field {
  name: string
  type?: FieldType
  schema?: {
    [key: string]: any
  }
  label?: string
  hidden?: boolean
  readonly?: boolean
  sortable?: boolean
  sortKey?: string
  multiline?: boolean
  options?: Option[] | AutocompleteProps
}

type AnyObject = Record<string, unknown>

interface Props {
  title?: string
  typeName: string
  fields: Field[]
  query: DocumentNode
  queryVariables?: AnyObject
  connectionName: string
  saveMutation?: DocumentNode
  saveResultExtractor(
    result: GenericDictionary,
  ): void | Error | GenericDictionary
  editDisabled?: boolean
  deleteMutation?: DocumentNode
  mutationVariables?: AnyObject | ((data: AnyObject) => AnyObject)
  searchVariable?: string
  initialSearch?: string
  sortVariable?: string
  initialSort?: string
  multiselect?: boolean
  actions?: Action[]
  onSuccess?: (result: string) => void
  onWarning?: () => void
  onError?(message: string): void
  onInfo?: () => void
  onResult?(result: GenericDictionary): void
  onAddClick?: () => void
  onAdded?: (data: AnyObject) => void
  onEditClick?: (data: AnyObject) => void
  onEdited?: (data: AnyObject) => void
  onDeleteClick?: (objects: AnyObject[]) => void
  onDeleted?: (objects: AnyObject[]) => void
}

type ActionType = "add" | "edit" | "delete"

const GraphqlTable: React.FC<Props> = ({
  title,
  typeName,
  fields,
  query,
  queryVariables,
  connectionName,
  saveMutation,
  saveResultExtractor,
  editDisabled,
  deleteMutation,
  mutationVariables,
  searchVariable,
  initialSearch,
  sortVariable,
  initialSort,
  multiselect = true,
  onSuccess = noop,
  onError = noop,
  onResult,
  onAddClick,
  onAdded,
  onEditClick,
  onEdited,
  onDeleteClick,
  onDeleted,
  ...props
}: Props) => {
  const [searchString, setSearchString] = useState<string>()
  const [activeSort, setActiveSort] = useState<string>()
  const [selectedObjects, setSelectedObjects] = useState<any[]>([])
  const [activeObject, setActiveObject] = useState<GenericDictionary>()
  const [objectsDeleting, setObjectsDeleting] = useState<GenericDictionary[]>(
    [],
  )
  const [currentAction, setCurrentAction] = useState<ActionType | undefined>()
  const classes = useStyles()

  useEffect(() => {
    setSearchString(initialSearch)
    setActiveSort(initialSort)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const variables = useMemo(() => {
    const v: GenericDictionary = {
      ...queryVariables,
    }

    if (searchVariable && initialSearch) {
      v[searchVariable] = initialSearch
    }

    if (sortVariable && initialSort) {
      v[sortVariable] = initialSort
    }

    return v
  }, [initialSearch, initialSort, queryVariables, searchVariable, sortVariable])

  const result = useQuery(query, {
    variables,
    notifyOnNetworkStatusChange: true,
  })

  useEffect(() => {
    if (result.data && typeof onResult === "function") {
      onResult(result.data)
    }
  }, [result, onResult])

  useEffect(() => {
    result.refetch(variables)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variables])

  const loading = result.networkStatus === 1
  const fetchingMore = result.networkStatus === 3
  const polling = result.networkStatus === 6
  const fetching = result.networkStatus < 7
  const editable = Boolean(saveMutation)
  const selectable = Boolean(deleteMutation)
  const adding = currentAction == "add"
  const editing = currentAction == "edit"
  const deleting = currentAction == "delete"

  const handleSearch = (searchString: string): void => {
    const variables: GenericDictionary = {
      ...queryVariables,
    }
    if (searchVariable) {
      variables[searchVariable] = searchString
    }
    if (sortVariable) {
      variables[sortVariable] = activeSort
    }
    result.refetch(variables)

    setSelectedObjects([])
  }

  const handleSortChange = (activeSort: string): void => {
    setActiveSort(activeSort)

    const variables: GenericDictionary = {
      ...queryVariables,
    }
    if (searchVariable) {
      variables[searchVariable] = searchString
    }
    if (sortVariable) {
      variables[sortVariable] = activeSort
    }
    result.refetch(variables)

    setSelectedObjects([])
  }

  const handleSelect = (object: any): void => {
    let objects = [...selectedObjects]
    if (multiselect) {
      const obj = _.find(objects, { id: object.id })
      if (obj) {
        _.remove(objects, { id: object.id })
      } else {
        objects.push(object)
      }
    } else {
      if (objects[0] == object) {
        objects = []
      } else {
        objects = [object]
      }
    }
    setSelectedObjects(objects)
  }

  const handleToggleSelection = (): void => {
    if (selectedObjects.length > 0) {
      setSelectedObjects([])
    } else {
      const objects = _(result.data)
        .get(`${connectionName}.edges`, [])
        .map((edge: any) => edge.node)
      setSelectedObjects(objects)
    }
  }

  const handleEdit = (object: any): void => {
    setActiveObject(object)
    if (object && typeof onEditClick === "function") {
      onEditClick(object)
    } else {
      setCurrentAction("edit")
    }
  }

  const handleDialogClose = (): void => {
    setCurrentAction(undefined)
  }

  const handleSave = (
    saveObject: (object: GenericDictionary) => Promise<any>,
  ): ((object: GenericDictionary) => Promise<any>) => {
    return async (values: GenericDictionary): Promise<any> => {
      let mutationResult
      try {
        let extraVariables = {}
        if (mutationVariables) {
          if (typeof mutationVariables === "function") {
            extraVariables = mutationVariables(result.data)
          } else {
            extraVariables = mutationVariables
          }
        }
        mutationResult = await saveObject({
          variables: {
            ...values,
            ...extraVariables,
          },
        })

        let saveResult
        if (saveResultExtractor && typeof saveResultExtractor === "function") {
          saveResult = saveResultExtractor(mutationResult)
        }

        if (saveResult instanceof Error) {
          onError(saveResult.message)
        } else {
          if (!values.id) {
            result.refetch(variables)
          }

          handleDialogClose()

          onSuccess(`${typeName} saved successfully.`)

          if (saveResult) {
            if (values.id) {
              if (typeof onEdited === "function") {
                onEdited(saveResult)
              }
            } else {
              if (typeof onAdded === "function") {
                onAdded(saveResult)
              }
            }
          }
        }
      } catch (err) {
        onError(`There was a problem saving ${typeName.toLowerCase()}!`)
        throw err
      }
      return mutationResult
    }
  }

  const handleDelete = (
    deleteObjects: (objects: GenericDictionary) => Promise<any>,
  ) => {
    return async (): Promise<any> => {
      const ids = selectedObjects.map((object) => object.id)

      setObjectsDeleting([...selectedObjects])
      setSelectedObjects([])
      handleDialogClose()

      let deleteResult
      try {
        let extraVariables = {}
        if (mutationVariables) {
          if (typeof mutationVariables === "function") {
            extraVariables = mutationVariables(result.data)
          } else {
            extraVariables = mutationVariables
          }
        }

        deleteResult = await deleteObjects({
          variables: {
            ids,
            ...extraVariables,
          },
        })

        if (typeof onDeleted === "function") {
          onDeleted([...selectedObjects])
        }

        await result.refetch(variables)

        onSuccess(
          `${ids.length} ${pluralize(
            typeName.toLowerCase(),
            ids.length,
          )} deleted.`,
        )
      } catch (err) {
        onError(
          `There was a problem deleting ${pluralize(
            typeName.toLowerCase(),
            ids.length,
          )}!`,
        )
        throw err
      } finally {
        setObjectsDeleting([])
      }

      return deleteResult
    }
  }

  const handleFabClick = (action: ActionType): void => {
    setActiveObject({})
    if (action === "add" && typeof onAddClick === "function") {
      onAddClick()
    } else if (action === "delete" && typeof onDeleteClick === "function") {
      onDeleteClick([...selectedObjects])
    } else {
      setCurrentAction(action)
    }
  }

  const renderFab = (): React.ReactNode => {
    if (deleteMutation && selectedObjects.length > 0) {
      return <Fab action="delete" onClick={handleFabClick} />
    }

    if (saveMutation) {
      return <Fab action="add" onClick={handleFabClick} />
    }

    return null
  }

  const renderFormDialog = (): React.ReactNode => {
    let title: string
    let description: string
    if (activeObject && activeObject.id) {
      title = editable ? `Edit ${typeName}` : typeName
      description = editable
        ? `Change an existing ${typeName.toLowerCase()}.`
        : `View an existing ${typeName.toLowerCase()}.`
    } else {
      title = `Add ${typeName}`
      description = `Create a new ${typeName.toLowerCase()}.`
    }

    if (saveMutation) {
      return (
        <Mutation mutation={saveMutation}>
          {(saveObject: any): any => (
            <FormDialog
              title={title}
              description={description}
              fields={fields}
              data={activeObject}
              saveObject={handleSave(saveObject)}
              open={adding || editing}
              onClose={handleDialogClose}
            />
          )}
        </Mutation>
      )
    } else {
      return (
        <FormDialog
          title={title}
          description={description}
          fields={fields}
          data={activeObject}
          open={adding || editing}
          onClose={handleDialogClose}
        />
      )
    }
  }

  const renderDeleteConfirmationDialog = (): React.ReactNode => {
    if (deleteMutation) {
      const title = `Delete ${pluralize(typeName, selectedObjects.length)}`
      const message = `Are you sure you want to delete the selected ${pluralize(
        // eslint-disable-next-line react/prop-types
        typeName.toLowerCase(),
        selectedObjects.length,
      )}?`

      return (
        <Mutation mutation={deleteMutation}>
          {(deleteObjects: any): any => (
            <ConfirmationDialog
              title={title}
              message={message}
              onConfirm={handleDelete(deleteObjects)}
              open={deleting}
              onClose={handleDialogClose}
            />
          )}
        </Mutation>
      )
    }
    return null
  }

  return (
    <>
      <Toolbar disableGutters>
        <Typography className={classes.title} variant="h6">
          {title}
        </Typography>
        {fetching && <CircularProgress />}
        {searchVariable && (
          <SearchField
            className={classes.searchField}
            value={searchString}
            onSearchValueChange={setSearchString}
            onSearch={handleSearch}
            disabled={loading || fetchingMore || polling}
          />
        )}
      </Toolbar>
      {selectable ? (
        <Typography className={classes.tableCellHead}>
          {selectedObjects.length} selected
        </Typography>
      ) : null}
      <ResultTable
        result={result}
        connectionName={connectionName}
        fields={fields}
        sort={activeSort}
        onSortChange={handleSortChange}
        selectedObjects={selectedObjects}
        objectsDeleting={objectsDeleting}
        onSelect={selectable ? handleSelect : undefined}
        onToggleSelection={selectable ? handleToggleSelection : undefined}
        onEdit={editDisabled ? undefined : handleEdit}
        editable={editable}
        {...props}
      />
      {renderFormDialog()}
      {renderDeleteConfirmationDialog()}
      {renderFab()}
    </>
  )
}

export default GraphqlTable

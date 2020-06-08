import { Field, Formik } from "formik"
import _ from "lodash"
import React from "react"
import * as yup from "yup"

import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import MuiTextField from "@material-ui/core/TextField"

import {
  AutocompleteField,
  RichTextField,
  SelectField,
  SwitchField,
  TextField,
  DialogActions,
  DialogTitle,
  Form,
} from "formik-material-ui-elements"

import { formatValue } from "./utils"
import type { Field as FieldType, AutocompleteProps } from "."

interface GenericDictionary {
  [key: string]: any
}

interface Props {
  title: string
  description?: string
  fields: FieldType[]
  data?: GenericDictionary
  saveObject?(object: GenericDictionary): void | Promise<any>
  open: boolean
  onClose: () => void
}

const FormDialog: React.FC<Props> = ({
  title,
  description,
  fields,
  data,
  saveObject,
  open = false,
  onClose,
}: Props) => {
  const adding = !data || !data.id
  const readonly = !saveObject

  const initialValues = fields.reduce((values, field) => {
    const object = {
      ...values,
    }
    let value = _.get(data, field.name, "")
    if (_.isNull(value) || _.isUndefined(value)) {
      if (field.schema) {
        value = field.schema.default() || ""
      } else {
        value = ""
      }
    }
    return _.set(object, field.name, value)
  }, {})

  const validationSchema = yup
    .object()
    .shape(
      fields.reduce(
        (schema, field) =>
          field.schema ? { ...schema, [field.name]: field.schema } : schema,
        {},
      ),
    )

  const transformValues = (values: GenericDictionary): GenericDictionary => {
    const transformedValues: GenericDictionary = {}
    Object.entries(values).forEach(([key, value]) => {
      const field = _.find(fields, { name: key })
      if (!field) return
      if (field.type === "autocomplete") {
        const completeOptions = field.options as AutocompleteProps
        const { saveArg = field.name, valuePath = "id" } = completeOptions
        transformedValues[saveArg] = _.get(value, valuePath)
      } else if (field.type === "editor") {
        if (
          value &&
          typeof value === "object" &&
          typeof value.toString === "function"
        ) {
          transformedValues[key] = value.toString("html")
        } else {
          transformedValues[key] = value
        }
      } else {
        transformedValues[key] = value
      }
    })
    return transformedValues
  }

  const handleSubmit = async (
    values: GenericDictionary,
    { setSubmitting }: { setSubmitting: (submitting: boolean) => void },
  ): Promise<any> => {
    try {
      const transformedValues = transformValues(values)
      if (typeof saveObject === "function") {
        await saveObject({
          ...transformedValues,
          id: data && data.id,
        })
      }
    } catch (err) {
      console.warn(err)
    }
    setSubmitting(false)
  }

  const renderFields = (): React.ReactNode => {
    return fields.map((field, index) => {
      const required = Boolean(
        field.schema &&
          _.find(field.schema.tests, { OPTIONS: { name: "required" } }),
      )
      if (field.readonly) {
        if (adding) return null

        const value = formatValue(field, _.get(data, field.name))
        return (
          <MuiTextField
            key={field.name}
            id={field.name}
            name={field.name}
            label={field.label}
            value={value}
            fullWidth
            variant="outlined"
            margin="normal"
            disabled
            multiline={field.multiline}
          />
        )
      } else {
        if (field.type === "autocomplete") {
          if (!field.options) {
            console.error(`Missing options for field: ${field.name}`)
            return null
          }

          if (Array.isArray(field.options)) {
            console.error(
              `options must be an object for autocomplete field: ${field.name}`,
            )
            return null
          }

          const { connectionName, labelPath, query, valuePath } = field.options
          return (
            <Field
              key={field.name}
              component={AutocompleteField}
              id={field.name}
              name={field.name}
              label={field.label}
              autoFocus={index === 0}
              required={required}
              disabled={readonly}
              connectionName={connectionName}
              labelPath={labelPath}
              query={query}
              valuePath={valuePath}
            />
          )
        } else if (field.type === "select") {
          return (
            <Field
              key={field.name}
              component={SelectField}
              id={field.name}
              name={field.name}
              label={field.label}
              autoFocus={index === 0}
              required={required}
              disabled={readonly}
              options={field.options}
            />
          )
        } else if (field.type === "switch") {
          return (
            <Field
              key={field.name}
              component={SwitchField}
              id={field.name}
              name={field.name}
              label={field.label}
              autoFocus={index === 0}
              required={required}
              disabled={readonly}
              options={field.options}
            />
          )
        } else if (field.type === "editor") {
          return (
            <Field
              key={field.name}
              component={RichTextField}
              id={field.name}
              name={field.name}
              label={field.label}
              autoFocus={index === 0}
              required={required}
              disabled={readonly}
              multiline={field.multiline}
            />
          )
        } else {
          return (
            <Field
              key={field.name}
              component={TextField}
              id={field.name}
              name={field.name}
              label={field.label}
              autoFocus={index === 0}
              required={required}
              disabled={readonly}
              multiline={field.multiline}
            />
          )
        }
      }
    })
  }

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title" onClose={onClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validateOnBlur={false}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ dirty, submitForm, isSubmitting }): React.ReactNode => (
          <Form noValidate>
            <DialogTitle id="form-dialog-title" onClose={onClose}>
              {title}
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText>{description}</DialogContentText>
              {renderFields()}
            </DialogContent>
            <DialogActions>
              {isSubmitting ? <CircularProgress /> : null}
              {saveObject ? (
                <Button
                  color="primary"
                  onClick={submitForm}
                  disabled={!dirty || isSubmitting}
                >
                  {data && data.id ? "Save Changes" : "Create"}
                </Button>
              ) : null}
              {onClose ? (
                <Button
                  color="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {readonly ? "Close" : "Cancel"}
                </Button>
              ) : null}
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

export default FormDialog

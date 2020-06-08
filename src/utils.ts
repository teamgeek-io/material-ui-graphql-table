import _ from "lodash"
import moment from "moment"
import { useEffect, useState } from "react"

import type { Field } from "."

export const formatValue = (field: Field, value: any): string => {
  if (field.type === "datetime") {
    return moment(value).format(process.env.DATE_TIME_FORMAT)
  }

  if (field.type === "autocomplete") {
    if (field.options) {
      const labelPath = _.get(field.options, "labelPath", "name")
      return _.get(value, labelPath, "")
    }
  }

  if (field.type === "select") {
    const value: any = _.find(field.options, (option) => {
      return option["value"] && option["value"] === value
    })
    return value?.label
  }

  if (field.type === "switch") {
    return value ? "Yes" : "No"
  }

  return value
}

export const useOnScreen = (
  ref: React.RefObject<HTMLElement>,
  rootMargin = "0px",
): boolean => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const current = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
      },
      {
        rootMargin,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return (): void => {
      if (current) {
        observer.unobserve(current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isIntersecting
}

import React, { useEffect, useRef } from "react"

import { useOnScreen } from "./utils"

interface Props {
  onVisible(): void
}

const VisibilityTrigger: React.FC<Props> = ({ onVisible }: Props) => {
  const visibilityEl = useRef(null)
  const onScreen = useOnScreen(visibilityEl)

  useEffect(() => {
    if (onScreen) {
      onVisible()
    }
  }, [onScreen, onVisible])

  return <div ref={visibilityEl}></div>
}

export default VisibilityTrigger

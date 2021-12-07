import {useState, useCallback} from "react"

function useForceUpdate() {
  const [, update] = useState(Object.create(null))
  return useCallback(() => {
    update(Object.create(null))
  }, [])
}

export {useForceUpdate}

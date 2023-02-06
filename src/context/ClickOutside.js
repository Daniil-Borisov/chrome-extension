import React, {useRef} from "react";

const defaultValue = null

export const ClickOutsideContext = React.createContext(defaultValue)

export const ClickOutsideProvider = ({ children }) => {
  const ref = useRef(null)
  return <div ref={ref}>
    <ClickOutsideContext.Provider value={ref.current}>
      {children}
    </ClickOutsideContext.Provider>
  </div>
}
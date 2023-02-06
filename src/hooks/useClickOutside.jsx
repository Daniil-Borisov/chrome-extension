import React, {useCallback, useContext, useEffect} from 'react';
// eslint-disable-next-line import/named
import {ClickOutsideContext} from "../context/ClickOutside";

export const useClickOutside = (element, button, open, dispatch) => {
  const  root = useContext(ClickOutsideContext)
  const handleClickOutside = useCallback((event) => {
    if (!element){
      return
    }
    if (element.contains(event.target)){
      return
    }
    if (button.contains(event.target)){
      return
    }
    dispatch(() => false)

  }, [element, button, dispatch])
  
  useEffect(() => {
    if (!root || !element || !button){
      return
    }
    if(open){
      root.addEventListener('click', handleClickOutside)
    } else{
      root.removeEventListener('click', handleClickOutside)
    }
  }, [open, element, button, dispatch])
  return root
};



export default useClickOutside;
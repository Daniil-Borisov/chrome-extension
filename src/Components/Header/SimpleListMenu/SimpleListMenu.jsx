import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React, {useCallback, useState} from "react";
import IconButton from "@mui/material/IconButton";
import './simpleListMenu.scss'
import { LOG } from '../../../Utils/debug';
import useClickOutside from "../../../hooks/useClickOutside";

const SimpleListMenu = ({options, setOption}) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [menuElement, setMenuElement] = useState(null)
  const menuRef = useCallback((element)=>{
    setMenuElement(element)
  },[])
  useClickOutside(menuElement, menuElement, isOpenMenu, setIsOpenMenu)

  const handleChange = (option) => {
    options = options.filter(el => el !== option )
    setOption([option, ...options])
    setIsOpenMenu(!isOpenMenu)
  };

  return (
    <div className={`iffy-simpleListMenu ${isOpenMenu ? 'iffy-open-menu' : ''}`} ref={menuRef}>
      <IconButton onClick={() => setIsOpenMenu(!isOpenMenu)} className='iffy-menu__item'>
        {options[0]}
        <KeyboardArrowDownIcon/>
      </IconButton>
      <div className="iffy-menu__list">
        {isOpenMenu && options.map((option, index) => (
          (index > 0) && <IconButton key={option} onClick={() => handleChange(option)} className='iffy-menu__item'>{option}</IconButton>
        ))}
      </div>
    </div>
  );
}

export default SimpleListMenu
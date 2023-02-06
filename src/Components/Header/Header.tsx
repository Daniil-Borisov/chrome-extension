import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import FilterListIcon from '@mui/icons-material/FilterList';
import { Grid } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { Box } from '@mui/system'
import React, {useCallback, useContext, useState} from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import '../../layout/Components.scss'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Profile from './Profile/Profile';
import SimpleListMenu from "./SimpleListMenu/SimpleListMenu";
import { AppContext } from "../../context/AppContext";
import { LOG } from '../../Utils/debug';
import useClickOutside from "../../hooks/useClickOutside";


const styles = {
  profileButton: {
    color: '#000000',
    fontSize: '15px',
    borderRadius: '10px',
    lineHeight: '20px',
    marginRight: '10px',
    letterSpacing: '-0.2px',
    fontWeight: '600',
  },
  commentsText: {
    fontSize: '10px',
    opacity: '0.55',
    margin: '0 0 0 6px',
  },
  buttonWrapper: {

  },
  button: {
    borderRadius: '50%',
    fontSize: '16px',
    padding: '3px',
    border: '1px solid #F1F1F3',
    marginLeft: '5px',
    display: 'flex',
    alignItems: 'center'
  }
}

const defaultMenu = [
  'General',
  'Profile',
  // 'Product'
]


const Header: React.FC = () => {
  const history = useHistory()
  const match = useRouteMatch()
  const [menu, setMenu] = useState(defaultMenu)
  const [dropdown, setDropdown] = useState(false)
  const [signOutElement, setSignOutElement] = useState(null)
  const [moreBtn, setMoreBtn] = useState(null)
  // @ts-ignore
  const { appState, setAppState } = useContext(AppContext)
  const signOutRef = useCallback((element)=>{
    setSignOutElement(element)
  },[])
  const moreBtnRef = useCallback((element)=>{
    setMoreBtn(element)
  },[])

  useClickOutside(signOutElement, moreBtn, dropdown, setDropdown)

  const handleSignOut = () => {
    chrome.runtime.sendMessage({
      from: "CS",
      action: "signOut"
    }, ({ res, err }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(2, `Header - signOut:lastError: ${JSON.stringify(lastErr)}`);
      } else if (res) {
        setAppState({
          ...appState,
          googleUser: null
        });
        setDropdown(false)
        history.push(`${match.url}/login`)
      } else if (err) {
        LOG(2, 'Header - signOut:error in signOut api', err)
      }
    });
   
  }

  return (
    <>
      <Grid container className="iffy-headerContainer">
        <Box className="iffy-generalButtonContainer">
          <SimpleListMenu options={menu} setOption={setMenu} />
        </Box>
        <Box className="iffy-closeButtonContainer">
          {/* <IconButton style={styles.button}>
            <FilterListIcon fontSize="inherit" style={{ color: 'black' }} />
          </IconButton> */}
          <div style={styles.buttonWrapper}>
            <IconButton onClick={() => setDropdown(!dropdown)} style={styles.button} ref={moreBtnRef}>
              <MoreVertIcon fontSize="inherit" style={{ color: 'black' }} />
            </IconButton>
            {dropdown && <div className='iffy-dropdown__menu' ref={signOutRef}>
              <IconButton
                onClick={handleSignOut}
                className={'iffy-dropdown__menu-item'}
              >
                Sign Out
              </IconButton>
              {/* <IconButton className={'iffy-dropdown__menu-item'}>Setting</IconButton> */}
            </div>}
          </div>
          <IconButton
            onClick={() => history.push('/')}
            size="small"
            style={styles.button}
          >
            <CloseRoundedIcon fontSize="inherit" style={{ color: 'black' }} />
          </IconButton>
        </Box>
      </Grid>
      {(menu[0] === defaultMenu[1]) && <Profile />}
    </>
  );
};

export default Header

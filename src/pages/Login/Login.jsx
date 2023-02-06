import React, {useContext, useEffect} from 'react';
import { Button, Container, Stack } from "@mui/material";
import './login.scss'
import { Box } from "@mui/system";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from "firebase/auth";
import { useHistory } from "react-router-dom";
import IconButton from '@mui/material/IconButton'
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AppContext } from '../../context/AppContext'
import { LOG } from '../../Utils/debug';
import Logo from '../../Assets/Images/Logo/logo.svg'
import FacebookLogo from '../../Assets/Images/Icons/facebookIcon.svg'
import GoogleLogo from '../../Assets/Images/Icons/GoogleLogo.svg'

const providerG = new GoogleAuthProvider()
const providerF = new FacebookAuthProvider()

const styles = {
  button:{
    borderRadius: '50%',
    fontSize: '16px',
    padding: '3px',
    border: '1px solid #F1F1F3',
    marginLeft: '5px',
    right: '15px',
    top: '10px'
  }
}
const Login = (props) => {
  // const { auth, setAuth } = useContext(AuthContext) as AuthContextType
  const { appState, setAppState } = useContext(AppContext);
  const history = useHistory()

  useEffect(()=>{
    props.getStyles()
  })

  const handleLogin = (provider) => {
    chrome.runtime.sendMessage({
      from: "CS",
      action: "continueWithGoogle"
    }, ({ googleUser, err }) => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr) {
        LOG(4, `Login - handleLogin:lastError: ${JSON.stringify(lastErr)}`);
      } else if (googleUser) {
        setAppState({
          ...appState,
          googleUser,
        });
        history.push(`/extension`)
      } else if (err) {
        LOG(2, 'Login - handleLogin:err', err);
      }
    });
  }

  return (
    <div className='iffy-login'>
      <IconButton
          onClick={() => history.push('/')}
          size="small"
          style={styles.button}
          className='iffy-close-button'
      >
        <CloseRoundedIcon fontSize="inherit" style={{ color: 'black' }} />
      </IconButton>
      <Container className='iffy-login__wrapper'>
        <img className='iffy-iffy-logo' src={Logo} alt=""/>
        <p>Join the iffy community. <br/> Start reviewing now.</p>
      </Container>
      <Box className="iffy-btnWrapper">
        <Button
          className="iffy-loginButton"
          variant="outlined"
          onClick={() => handleLogin(providerG)}
        >
          <Stack direction="row" justifyContent="center" alignItems="center">
            <img src={GoogleLogo} alt="Google" />
            <Box component="span">
              Continue with Google
            </Box>
          </Stack>
        </Button>
        {/* <Button
          className="iffy-loginButton iffy-facebookBtn"
          variant="outlined"
          onClick={() => handleLogin(providerF)}
        >
          <Stack direction="row" justifyContent="center" alignItems="center">
            <img
              src={FacebookLogo}
              alt="Facebook"
              className="iffy-facebookLoginButton"
            />
            <Box component="span">
              Continue with Facebook
            </Box>
          </Stack>
        </Button> */}
      </Box>
    </div>
  );
};

export default Login;


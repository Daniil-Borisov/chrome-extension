import { Paper } from '@mui/material'
import { Box } from '@mui/system'
import React, {useContext, useEffect, useState} from 'react'
import Draggable from 'react-draggable'
import { useHistory } from 'react-router-dom'
import { LOG } from '../../Utils/debug';
import './StartButton.scss'
import ProductMenu from "../ProductMenu/productMenu";
import {AppContext} from "../../context/AppContext";

const StartButton = () => {
  const { appState, setAppState, loading } = useContext(AppContext);
  const [dragging, setDragging] = useState(false);
  const [positionVal, setPositionVal] = useState({
    x: 0,
    y: appState.btnPosition || 350,
  })
  const [ isReady, setIsReady ] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsReady(false);
    
    }
    const timer = setTimeout(() => {
      LOG(4, 'StartButton - This will run after 0.5 second!')
      setIsReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [loading]);

  const history = useHistory()

  const onControlledDragStop = (e, position) => {
    setDragging(false);
    setPositionVal({ ...positionVal, y: position.lastY })
    setAppState({
      ...appState,
      btnPosition: position.lastY
    });
  }

  useEffect(() => {
    const tempPosition = positionVal.y.toString()
  }, [positionVal]);

  return (
    <div>
    {isReady ? 
        <Box className="iffy-floatingButtonContainer">
          <Box sx={{ pointerEvents: 'auto' }}>
            <Draggable
              axis="y"
              bounds="body"
              onDrag={() => setDragging(true)}
              onStop={onControlledDragStop}
              defaultPosition={positionVal}
            >
              <Paper className="iffy-floatButton">
                <ProductMenu style={{top: 0, right: 0}}/>
              </Paper>
            </Draggable>
          </Box>
        </Box> : <div/>}
    </div>
  )
}

export default StartButton

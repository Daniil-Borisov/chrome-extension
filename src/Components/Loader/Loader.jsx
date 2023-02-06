import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'
import { useSelector } from 'react-redux'
import '../../layout/Components.scss'

const Loader = () => {
  const bodyLoading = useSelector(({ AuthUser }) => AuthUser.loading);
  
  return (
    bodyLoading && (
      <Box className="iffy-loader">
        <Box className="iffy-absoluteCenter">
          <CircularProgress />
        </Box>
      </Box>
    )
  )
}

export default Loader
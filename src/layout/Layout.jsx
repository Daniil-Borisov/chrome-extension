import { Box, Card } from '@mui/material'
import React, {useContext, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import './Layout.scss'
import Header from '../Components/Header/Header'
import {AppContext} from "../context/AppContext";

const Layout = (props) => {
    const { appState } = useContext(AppContext)

    return (
        <Card className="iffy-mainCommentContainer" variant="outlined">
            <Box sx={{height: '100%'}}>{props.children}</Box>
        </Card>
    )
}

export default withRouter(Layout)

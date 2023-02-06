import React, {useEffect, useContext, useState} from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import Frame from 'react-frame-component';
import { CommentProvider } from '../../context/CommentsContext'
import { ClickOutsideProvider } from '../../context/ClickOutside'
import Layout from '../../layout/Layout'
import CommentPage from '../../pages/CommentPage/CommentPage'
import Login from "../../pages/Login/Login";
import Header from "../Header/Header";


const Extension = () => {
  const match = useRouteMatch()
  const [styleState, setStyleState] = useState('')
  const getStyles = () => {
    const styleTags = document.querySelectorAll('style')
    let styles = ''
    styleTags.forEach((el) => {
      styles += el.innerText
    })
    styles += '@import url("https://fonts.googleapis.com/css2?family=Mukta:wght@200;300;400;500;600;800&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");@import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");@import url("https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");body,html{background:#F3F5F9;min-width:unset;width:100%;box-sizing:border-box;font-family:\'Work Sans\',sans-serif}'
    setStyleState(styles)
  }

  return (
    <Layout>
      <Frame id='iffy-frame'
       head={
          <>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;400&display=swap" rel="stylesheet"/>
          <style>{styleState}</style>
          </>
        } 
        style={{height: '100%'}}
      >
        <Switch>
          <Route exact path={`${match.url}/`}>
            <CommentProvider>
              <ClickOutsideProvider>
                <Header/>
                <CommentPage getStyles={getStyles} />
              </ClickOutsideProvider>
            </CommentProvider>
          </Route>
          <Route path={`${match.url}/login`}>
            <Login getStyles={getStyles}/>
          </Route>
        </Switch>
      </Frame>
    </Layout>
  )
}

export default Extension

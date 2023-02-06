import React, { Suspense, useState } from 'react'
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom'
import ViewExtension from '../Components/Extension/Extension'
import Loader from '../Components/Loader/Loader'
import StartButton from '../Components/StartButton/StartButton'
import { CommentPos } from '../types'

function Extension() {
  const env = process.env.REACT_APP_ENV
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <Switch>
          <Route exact path="/" component={StartButton} />
          <Route path="/extension" component={ViewExtension} />
        </Switch>
      </Router>
    </Suspense>
  )
}

export default Extension

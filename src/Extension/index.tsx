import React from 'react'
import ReactDOM from 'react-dom'
import Extension from './Extension'
import AppProvider from '../context/AppContext'
import './index.css'

require("file-loader?name=[name].[ext]!./extension.html")

let disabledList = ['https://www.youtube.com', 'https://www.notion.so'];

if (!disabledList.includes(window.location.origin.toString())) {
  const div = document.createElement('DIV')
  ReactDOM.render(
      <AppProvider>
        <Extension />
      </AppProvider>,
    document.body.appendChild(div)
  )
}


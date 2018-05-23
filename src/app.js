//app.js
import React from 'react'
import ReactDOM from 'react-dom'
import App from '../server/App.jsx'
import {util} from './index'

console.log(util)
ReactDOM.render(<App />, document.getElementById('root'))

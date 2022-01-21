import React from 'react'
import ReactDOM from 'react-dom'
import { DefaultRoute, IndexRoute } from './components/layout'
import { Switch } from 'wouter'
import IndexPage from './pages/index'
import PlayerPage from './pages/index/player'
// import reportWebVitals from './reportWebVitals'
import './index.scss'

ReactDOM.render(
  <React.StrictMode>
    <Switch>
      <IndexRoute path="/" component={IndexPage} />
      <DefaultRoute path="/bangumi/play/:id" component={PlayerPage} />
      <DefaultRoute path="/:rest*">
        {(params) => `404, Sorry the page ${params.rest} does not exist!`}
      </DefaultRoute>
    </Switch>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()

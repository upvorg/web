import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import { DefaultRoute, IndexRoute } from './components/layout'
import { Router, Switch } from 'wouter'
// import reportWebVitals from './reportWebVitals'
import './index.scss'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Suspense fallback={null}>
        <Switch>
          <IndexRoute path="/" component={lazy(() => import('./pages/index'))} />
          <DefaultRoute path="/bangumi/play/:id" component={lazy(() => import('./pages/player'))} />
          <DefaultRoute path="/:rest*">
            {(params) => (
              <p
                style={{ marginTop: '2em' }}
              >{`404, Sorry the page ${params.rest} does not exist!`}</p>
            )}
          </DefaultRoute>
        </Switch>
      </Suspense>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()

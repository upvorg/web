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
          <DefaultRoute path="/search" component={lazy(() => import('./pages/search'))} />
          {/* <DefaultRoute path="/anime/index/" component={lazy(() => import('./pages/search'))} /> */}
          <DefaultRoute path="/bangumi/play/:id" component={lazy(() => import('./pages/player'))} />
          <DefaultRoute path="/about" component={lazy(() => import('./pages/about'))} />
          <DefaultRoute path="/:rest*">
            {(params) => (
              <p
                style={{ marginTop: '2em' }}
              >{`404, Sorry the page ${params.rest} does not exist!`}</p>
            )}
          </DefaultRoute>
        </Switch>
        <footer className="footer">
          <div className="content" style={{ textAlign: 'center' }}>
            <p>
              <strong className="font-family-logo">UPV</strong>
              {'  '}The <a href="https://github.com/upvorg/cdn">source code</a> is licensed{' '}
              <a href="https://opensource.org/licenses/GPL-3.0">GPL-3.0</a>. The website content is
              licensed{' '}
              <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
            </p>
          </div>
        </footer>
      </Suspense>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()

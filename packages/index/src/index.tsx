import { Router, Switch } from 'wouter'
import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { DefaultRoute, IndexRoute } from './components/layout'

import './index.scss'

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Router>
    <Suspense fallback={null}>
      <Switch>
        <IndexRoute path="/" component={lazy(() => import('./pages/index'))} />
        <DefaultRoute path="/search" component={lazy(() => import('./pages/search'))} />
        <DefaultRoute path="/bangumi/play/:id" component={lazy(() => import('./pages/player'))} />
        <DefaultRoute path="/about" component={lazy(() => import('./pages/about'))} />
        <DefaultRoute path="/:rest*" component={lazy(() => import('./pages/404'))} />
      </Switch>
      <footer className="footer">
        <div className="bd-footer-support">
          <h4 className="bd-footer-title">
            <strong>Support</strong> <span className="font-family-logo">UPV</span>
          </h4>
        </div>
        <div className="content" style={{ textAlign: 'center' }}>
          <p>
            <strong className="font-family-logo">UPV</strong>
            {'  '}The <a href="https://github.com/upvorg">source code</a> is licensed{' '}
            <a href="https://opensource.org/licenses/GPL-3.0">GPL-3.0</a>. The website content is
            licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>
            .
          </p>
        </div>
      </footer>
    </Suspense>
  </Router>
  // </React.StrictMode>
)

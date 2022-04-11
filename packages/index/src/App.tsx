import '@web/shared/f12'
import { Router, Switch } from 'wouter'
import { lazy, Suspense, useEffect } from 'react'
import { DefaultRoute, IndexRoute } from './components/layout'
import toast, { Toaster } from 'react-hot-toast'
import {
  axios,
  Cookie,
  COOKIE_ACCESS_TOKEN_KEY,
  HOST,
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_USER_INFO_KEY,
  PRIMARY_COLOR
} from '@web/shared'

import './index.scss'

axios.interceptors.request.use((config) => {
  const ck = Cookie.get(COOKIE_ACCESS_TOKEN_KEY)
  return {
    ...config,
    Authorization: ck || ''
  }
})

axios.interceptors.response.use(
  (data) => data,
  (res) => {
    res.msg && toast.error(res.msg)
    if (res.status === 401) {
      Cookie.del(COOKIE_ACCESS_TOKEN_KEY, '/', HOST)
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
      localStorage.removeItem(LOCAL_STORAGE_USER_INFO_KEY)
    }
    return res
  }
)

const App = () => {
  useEffect(() => {
    const cookie = Cookie.get(COOKIE_ACCESS_TOKEN_KEY)
    !!cookie && localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, cookie)

    if (!localStorage.getItem(LOCAL_STORAGE_USER_INFO_KEY) && !!cookie) {
      axios.get('/me').then((_) => {
        _.data && localStorage.setItem(LOCAL_STORAGE_USER_INFO_KEY, JSON.stringify(_.data))
      })
    }
  }, [])

  return (
    <Router>
      <Suspense fallback={null}>
        <Switch>
          <IndexRoute path="/" component={lazy(() => import('./pages/index'))} />
          <DefaultRoute path="/search" component={lazy(() => import('./pages/search'))} />
          <DefaultRoute path="/bangumi/play/:id" component={lazy(() => import('./pages/player'))} />
          <DefaultRoute path="/post/:id" component={lazy(() => import('./pages/post'))} />
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
              licensed{' '}
              <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
            </p>
          </div>
        </footer>

        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              iconTheme: {
                primary: PRIMARY_COLOR,
                secondary: '#fff'
              }
            }
          }}
          containerStyle={{ top: 70, right: 20 }}
        />
      </Suspense>
    </Router>
  )
}

export default App
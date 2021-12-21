import React, { Component, ComponentType, Suspense } from 'react'
import { render } from 'react-dom'
import useLocation from './use-location'
import Home from './component/home'

const Search = React.lazy(() => import('./component/search'))
const Page = React.lazy(() => import('./component/page'))

const SuspenseComponent = ({ children }) => (
  <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
)

const App = () => {
  const [location, setLocation] = useLocation()
  const p = location.match(/gv(\S*)+/)
  const s = location.match(/search\/(\S*)+/)

  if (location === '/') {
    return <Home push={setLocation} />
  } else if (p) {
    return (
      <SuspenseComponent>
        <Page gv={p[1]} />
      </SuspenseComponent>
    )
  } else if (s) {
    return (
      <SuspenseComponent>
        <Search word={s[1]} push={setLocation} />
      </SuspenseComponent>
    )
  } else {
    return 404
  }
}

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// if (new Date().getTime() < new Date('2020-04-04').setHours(23, 59, 59, 999)) root.style = 'filter:grayscale(100%)'

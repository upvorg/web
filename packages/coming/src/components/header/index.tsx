import { useEffect, useRef, useState } from 'react'
import { Link, useRoute } from 'wouter'

import './index.scss'

export default function Header() {
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search')
  const searchValue = useRef('')

  useEffect(() => {
    const $navbarBurger: HTMLHRElement = document.querySelector('.navbar-burger')!
    fetch('//v1.hitokoto.cn?c=a')
      .then((res) => res.json())
      .then((data) => {
        setSearchPlaceholder(data.hitokoto)
      })
    $navbarBurger.addEventListener('click', () => {
      const target = $navbarBurger.dataset.target!
      const $target = document.getElementById(target)

      $navbarBurger.classList.toggle('is-active')
      $target!.classList.toggle('is-active')
    })
  }, [])
  const [isSearchPage] = useRoute('/search')

  return (
    <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item">
            <h1 className="logo">UPV</h1>
          </a>
        </Link>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="upv-nav"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="upv-nav" className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" href="/">
            首页
          </Link>
          <Link className="navbar-item" href="/anime/index/">
            新番时间表
          </Link>
          <a className="navbar-item" href="//app.upv.life">
            APP 下载
          </a>
          <a className="navbar-item" href="https://jq.qq.com/?_wv=1027&k=5lfSD1B">
            加入我们
          </a>
          <a className="navbar-item" href="//app.upv.life">
            关于我们
          </a>
        </div>

        {!isSearchPage && (
          <div className="navbar-item center-search">
            <form
              className="nav-search-form"
              onSubmit={(e) => {
                e.preventDefault()
                window.open(`/search?keyword=${searchValue.current}`)
              }}
            >
              <div className="nav-search-content">
                <input
                  className="nav-search-input"
                  type="text"
                  autoComplete="off"
                  accessKey="s"
                  maxLength={100}
                  x-webkit-speech=""
                  x-webkit-grammar="builtin:translate"
                  placeholder={searchPlaceholder}
                  title={searchPlaceholder}
                  onChange={(e) => {
                    searchValue.current = e.target.value
                  }}
                />
                <div className="nav-search-clean">
                  <button className="delete is-small" type="reset"></button>
                </div>
              </div>
              <span className="nav-search-btn icon">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="search"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="svg-inline--fa fa-search fa-w-16 fa-fw"
                >
                  <path
                    fill="currentColor"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  ></path>
                </svg>
              </span>
            </form>
          </div>
        )}
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-primary" href="//admin.upv.life">
                <strong>Sign up</strong>
              </a>
              <a className="button is-light" href="//admin.upv.life">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

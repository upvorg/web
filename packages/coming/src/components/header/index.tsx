import { useEffect } from 'react'
import { Link } from 'wouter'

import './index.scss'

export default function Header() {
  useEffect(() => {
    const $navbarBurger: HTMLHRElement = document.querySelector('.navbar-burger')!

    $navbarBurger.addEventListener('click', () => {
      const target = $navbarBurger.dataset.target!
      const $target = document.getElementById(target)

      $navbarBurger.classList.toggle('is-active')
      $target!.classList.toggle('is-active')
    })
  }, [])

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

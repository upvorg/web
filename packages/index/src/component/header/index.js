import { clink, alink } from 'public/js/const'
import './index.styl'
import Search from 'widget/search'
import { useEffect, useState } from 'react'

export default function Header({ push }) {
  const [user, setUser] = useState({})
  const obj = {
    投稿教程: 905,
    使用说明: 31,
    补档: 99
  }

  // useEffect(() => {
  //   setUser(JSON.parse(localStorage.getItem('USER_INFO')))
  //   console.log(JSON.parse(localStorage.getItem('USER_INFO')))
  // }, [])

  return (
    <header>
      <div className="header">
        <div className="wrap">
          <nav className="nav">
            <a onClick={() => push('/')}>
              <li className="active">主站</li>
            </a>
            {/* <a href="https://app.clicli.me">
                <li>APP 下载</li>
              </a> */}
            {Object.keys(obj).map((key) => (
              <li onClick={() => push(`/play/gv${obj[key]}`)} key={key}>
                {key}
              </li>
            ))}
          </nav>
          <div className="biu">
            {/* {user ? (
              <div className="user">
                <img src={user.avatar} alt="" />
                <span>{user.username}</span>
              </div>
            ) : (
              <>
                <a className="login" href={`${alink}/login`}>
                  登录
                </a>
                <a className="login" href={`${alink}/register`}>
                  注册
                </a>
              </>
            )} */}
            <a className="user-center" href={alink}>
              投稿
            </a>
          </div>
        </div>
        <div className="wrap">
          <div className="logo"></div>
          <Search push={push} />
        </div>
      </div>
    </header>
  )
}

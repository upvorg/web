import { useRef, useEffect, useState } from 'react'
import './index.styl'
import VideoList from 'component/video-list'
import { getPostDetail, getPv } from '../../api/get'
import { getAvatar } from '../../public/js/util'
import markdownit from 'markdown-it'

export default function PostDetal(props) {
  const t = useRef(null)
  const u = useRef(null)
  const [post, setPost] = useState({})
  const [pv, setPv] = useState(0)
  useEffect(() => {
    getPostDetail(props.gv).then((res) => {
      setPost(res.data)
      getPv(props.gv).then((ret) => {
        setPv(ret.data.pv)
      })
      const w = document.body.clientWidth
      if (res.data.tag.indexOf('其它') > -1 || w < 480) {
        t.current.style.display = 'none'
        u.current.style.display = 'block'
        u.current.innerHTML = markdownit().render(res.data.content)
      } else {
        t.current.innerHTML = markdownit().render(res.data.content)
      }
    })
  }, [props.gv])

  return (
    <div className="post-detail">
      <article className="left" ref={t}></article>
      <div className="right">
        <div className="info">
          <div className="user">
            <span className="avatar">
              <img src={getAvatar(post.creator_qq)} alt={post.creator_qq}></img>
            </span>
            <span className="uname">{post.creator_name}</span>
            <span className="uid">uid：{post.creator_id}</span>
          </div>
          <div className="title">
            <h1>{post.title || '少年祈祷中……'}</h1>
            <span className="pv">{pv} ℃ </span>
          </div>
          <div>
            <span>{post.tag}</span>
            <span>{post.create_time}</span>
          </div>
          <article ref={u} className="other"></article>
        </div>
        {post.status == 3 ? (
          <VideoList gv={props.gv} />
        ) : (
          <div className="copyright">版权原因，该番剧未上架，请支持正版</div>
        )}
      </div>
    </div>
  )
}

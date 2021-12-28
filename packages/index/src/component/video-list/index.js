import { useState, useEffect } from 'react'
import Eplayer from '../../widget/eplayer'
import { getVideoList } from '../../api/get'
import { getAvatar } from 'public/js/util'
import './index.styl'

export default function VideoList(props) {
  const [video, setVideo] = useState([])
  const [content, setContent] = useState(null)
  useEffect(() => {
    getVideoList(props.gv).then((res) => {
      setVideo(res.data || [])
    })
  }, [props.gv])

  function hide() {
    setContent(null)
    document.body.style.overflow = 'auto'
  }

  function show(url) {
    setContent(url)
    document.body.style.overflow = 'hidden'
  }
  return (
    <div className="video-list">
      {video.length < 27
        ? video.map((item) => {
            return (
              <li className="item" onClick={() => show(item.content)} key={item.oid}>
                <img src={item.creator_avatar} alt="avatar"></img>
                <span>P {item.oid}</span>
                <span>{item.title}</span>
              </li>
            )
          })
        : video.map((item) => {
            return (
              <li className="item2" onClick={() => show(item.content)} key={item.oid}>
                <span>P {item.oid}</span>
              </li>
            )
          })}
      {content && <Eplayer url={content} hide={hide} />}
    </div>
  )
}

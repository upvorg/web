import { useEffect, useState } from 'react'
import { axios } from '@web/shared'
import './index.scss'

const Comment = ({ id }: any) => {
  const [comments, setComments] = useState([])

  useEffect(() => {
    axios.get(`/post/${id}/comments`).then((c) => {
      c.data && setComments(c.data)
    })
  }, [])

  return (
    <div className="video-comment">
      <div className="video-comment__title">
        <h4>评论</h4>
      </div>
      <div className="video-comment-edit">
        <img
          className="video-comment-edit__avatar"
          src={'https://upv.life/ic_launcher_round.png'}
          alt=""
        />
        <textarea
          className="video-comment-edit__input"
          placeholder="下载 APP 参与互动..."
          disabled
        ></textarea>
      </div>
      <div className="comment-list">
        {comments.length > 0 ? (
          <ul>
            {comments.map((item: any) => (
              <li key={item.id} className="comment-item">
                <div className="comment-item__head">
                  <img className="comment-item__avatar" src={item.creator_avatar} alt="" />
                  <div>
                    <span className="comment-item__name">{item.creator_nickname}</span>
                    <p className="comment-item__time">{item.create_time}</p>
                  </div>
                </div>
                <div className="comment-item__content">
                  <p>{item.content}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">暂无评论</p>
        )}
      </div>
    </div>
  )
}

export default Comment

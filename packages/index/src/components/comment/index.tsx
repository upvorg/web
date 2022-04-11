import { useEffect, useState } from 'react'
import { axios } from '@web/shared'
import { CommentSkeleton } from '/src/skeleton/CommentSkeleton'
import './index.scss'

const Comment = ({ id }: any) => {
  const [comments, setComments] = useState<any[] | null>(null)
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    axios.get(`/post/${id}/comments`).then((c) => {
      setComments(c?.data || [])
    })
  }, [])

  const doComment = () => {
    axios.post(`/post/${id}/comments`).then((_) => {
      const newComment = {
        id: Date.now(),
        create_time: Date.now(),
        content: comment,
        creator_avatar: '',
        creator_name: ''
      }
      setComments([newComment, ...comments!])
    })
  }

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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          disabled
          className="button is-primary video-comment-edit__button"
          onClick={doComment}
        >
          评论
        </button>
      </div>
      <div className="comment-list">
        {comments ? (
          comments.length > 0 ? (
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
          )
        ) : (
          <CommentSkeleton />
        )}
      </div>
    </div>
  )
}

export default Comment

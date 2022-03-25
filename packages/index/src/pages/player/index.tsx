import { useEffect, useState } from 'react'
import Markdown from '../../components/markdown'
import UPlayer from '../../components/player'
import { axios } from '@web/shared'
import { getCoverFormMd, removeImagesFormMd } from '@web/shared'
import './index.scss'

export default function PlayerPage(props: any) {
  const [state, setState] = useState<any>({})
  const [video, setVideo] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [playerIsPlaying, setPlayerIsPlaying] = useState<boolean>(false)

  useEffect(() => {
    Promise.all([axios.get(`/post/${props.id}`), axios.get(`/videos?pid=${props.id}&page=1&pageSize=222`)]).then(
      ([a, b]) => {
        a.data && setState(a.data)
        b.data.sort((a: { oid: number }, b: { oid: number }) => a.oid - b.oid)
        b.data && setVideo(b.data)
      }
    )
    axios.post(`/pv/${props.id}`)
  }, [])

  return (
    <>
      <div className="player-header">
        <div className="player-header__player">
          <UPlayer src={video[currentIndex]?.content} playerIsPlaying={playerIsPlaying} />
        </div>
        <div className="player-header__r">
          <div className="eplist_module">
            <div className="list-title">
              <h4>播放列表</h4>
              <span className="ep-list-progress">
                {video.length > 0 ? currentIndex + 1 : 0}/{video.length}
              </span>
            </div>
            <div className="list-wrapper">
              {video.length > 0 ? (
                <ul>
                  {video.map((item, i) => (
                    <a key={i}>
                      <li
                        className={'list-item ' + (i === currentIndex ? 'cursor' : '')}
                        onClick={() => {
                          setCurrentIndex(i)
                          setPlayerIsPlaying(true)
                        }}
                      >
                        <span> {item.oid}</span>
                      </li>
                    </a>
                  ))}
                </ul>
              ) : (
                <span className="empty">暂无视频</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="player-body">
        {state.id && (
          <div className="player-body__meta">
            <img src={getCoverFormMd(state.content ?? '')?.url} alt="" />
            <div>
              <h3>{state.title}</h3>
              <Markdown type="render" value={removeImagesFormMd(state.content ?? '')} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

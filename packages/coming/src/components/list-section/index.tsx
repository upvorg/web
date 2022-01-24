import VideoCard from '../video-card'
import './index.scss'

interface ListSectionProps {
  title: string
  videos: any[]
  asideTitle?: string
  aside?: React.ReactNode
}

export default function ListSection({ title, videos, asideTitle, aside }: ListSectionProps) {
  return (
    <div className={`upv-grid ${!!asideTitle ? 'col-2' : ''}`}>
      <div className="upv-card-list">
        <div className="list-header">
          <h2>{title}</h2>
        </div>
        <div className="list-body ">
          {videos ? (
            videos.length > 0 ? (
              videos.map((item, index) => <VideoCard key={index} info={item} />)
            ) : (
              <div className="empty">暂无数据</div>
            )
          ) : (
            <span className="loading empty">加载中···</span>
          )}
        </div>
      </div>

      {!!asideTitle && (
        <aside>
          <div className="aside-header">
            <div className="aside-title">{asideTitle}</div>
            {/* <div>更多</div> */}
          </div>
          <div className="aside-body">{aside}</div>
        </aside>
      )}
    </div>
  )
}

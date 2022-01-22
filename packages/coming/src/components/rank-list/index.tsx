import { Link } from 'wouter'

import './index.scss'

export default function RankList({ list }: { list: any[] }) {
  return (
    <div className="rank-video-list">
      <ul className="rank-video-list__list">
        {list.length > 0 ? (
          list.map((item, i) => (
            <Link href={`/bangumi/play/${item.id}`} key={i}>
              <li className="rank-video-list__item">
                <span className="rank-video-list__item--index" data-index={i}>
                  {i + 1}
                </span>
                <h3>{item.title}</h3>
              </li>
            </Link>
          ))
        ) : (
          <div className="empty">暂无数据</div>
        )}
      </ul>
    </div>
  )
}

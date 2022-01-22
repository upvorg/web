import { Link } from 'wouter'
import { getCoverFormMd } from '@web/shared'

import './index.scss'

export default function VideoCard({ info }: any) {
  return (
    <div className="upv-video-card">
      <div className="upv-video-card__wrap">
        <Link href={`/bangumi/play/${info.id}`}>
          <div className="upv-video-card__image">
            <div className="upv-video-card__image--wrap">
              <img src={getCoverFormMd(info.content).url} />
            </div>
          </div>
        </Link>
        <div className="upv-video-card__content">
          <div className="upv-video-card__content__title">{info.title}</div>
          <div className="upv-video-card__content__subtitle">{info.creator_name}</div>
        </div>
      </div>
    </div>
  )
}

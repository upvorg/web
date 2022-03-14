import { getCoverFormMd } from '@web/shared'

import './index.scss'

const ImageType = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  png: 'image/png'
}

export default function VideoCard({ info }: any) {
  const { url, type } = getCoverFormMd(info.content)
  return (
    <div className="upv-video-card">
      <div className="upv-video-card__wrap">
        <a href={`/bangumi/play/${info.id}`} target="_blank">
          <div className="upv-video-card__image">
            <div className="upv-video-card__image--wrap">
              <picture>
                <source
                  srcSet={url}
                  type={ImageType[type! as keyof typeof ImageType]}
                  title={info.title}
                />
                <img src="https://s2.loli.net/2022/01/22/IkS53uazMbyYHsp.jpg" alt={info.title} />
              </picture>
            </div>
          </div>
        </a>
        <div className="upv-video-card__content">
          <div className="upv-video-card__content__title">{info.title}</div>
          <div className="upv-video-card__content__subtitle">{info.creator_name}</div>
        </div>
      </div>
    </div>
  )
}

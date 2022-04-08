import { useEffect, useRef } from 'react'
import DPlayer from 'dplayer'

type Props = { url: string }

export const ReactDPlayer = ({ url }: Props) => {
  const $ = useRef<HTMLDivElement>(null)
  const dp = useRef<DPlayer>()

  useEffect(() => {
    if (!dp.current && url && $.current) {
      dp.current = new DPlayer({
        container: $.current,
        video: { url },
        theme: '#6668ab'
      })
    }
  }, [$.current, url])

  useEffect(() => {
    // @ts-ignore
    dp.current?.switchVideo({ url })

    return () => dp.current?.seek(0)
  }, [url])

  return <div ref={$}></div>
}

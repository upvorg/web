import { useEffect, useRef } from 'react'
import DPlayer from 'dplayer'

export const ReactDPlayer = ({ url, isPlaying = false }: { url: string; isPlaying: boolean }) => {
  const $ = useRef<HTMLDivElement>(null)
  const dp = useRef<DPlayer>()

  useEffect(() => {
    dp.current = new DPlayer({
      container: $.current,
      video: { url },
      theme: '#6668ab'
    })

    return () => dp.current?.destroy()
  }, [$.current])

  useEffect(() => {
    if (isPlaying) {
      dp.current?.play()
    } else {
      dp.current?.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    // @ts-ignore
    dp.current?.switchVideo({ url })

    return () => dp.current?.pause()
  }, [url])

  return <div ref={$}></div>
}

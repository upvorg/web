import React from 'react'
import Player, { MessageContext } from 'griffith'
import { ACTIONS } from 'griffith-message'

import './index.scss'

interface UPlayerProps {
  src: string
  playerIsPlaying?: boolean
}
export default function UPlayer({ src, playerIsPlaying = false }: UPlayerProps) {
  return (
    <div className="upv-player">
      <Player
        autoplay
        // 'https://zhstatic.zhihu.com/cfe/griffith/zhihu2018_hd.mp4'
        sources={{ hd: { play_url: src } }}
        id={src}
      >
        <MessageContext.Consumer>
          {({ dispatchAction }) => (
            <ActionRegister dispatchAction={dispatchAction} playerIsPlaying={playerIsPlaying} />
          )}
        </MessageContext.Consumer>
      </Player>
    </div>
  )
}

class ActionRegister extends React.Component<{
  dispatchAction: (action: ACTIONS) => void
  playerIsPlaying: boolean
}> {
  componentDidUpdate() {
    const { dispatchAction, playerIsPlaying } = this.props
    if (playerIsPlaying) {
      dispatchAction(ACTIONS.PLAY)
    } else {
      dispatchAction(ACTIONS.PAUSE)
    }
  }
  render = () => null
}

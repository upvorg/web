import { useEffect, useRef, useState } from 'react'
import { getPlayUrl } from '../../api/get'
import Player from 'griffith'
import './index.styl'

export default function Eplayer(props) {
  // const [values, setValue] = useState('null')
  // useEffect(() => {
  //   getPlayUrl(props.url).then((res) => {
  //     setValue(res.data)
  //   })
  // }, [props.url])

  console.log(props.url)

  return (
    <div className="ep-wrap ">
      <div className="ep">
        <Player
          className="ep"
          sources={{
            hd: { play_url: props.url }
          }}
        />
        <div className="close" onClick={props.hide}>
          <i className="icon-font icon-close"></i>
        </div>
      </div>
      <div className="mark"></div>
    </div>
  )
}

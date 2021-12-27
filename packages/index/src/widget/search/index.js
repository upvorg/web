import { useState, useEffect } from 'react'
import { clink } from 'public/js/const'
import './index.styl'

export default function Search({ push }) {
  const [word, setWord] = useState('')
  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.keyCode == 13 && word) {
        push(`/search/${word}`)
      }
    }
  })
  const inputWord = (e) => {
    setWord(e.target.value)
  }
  return (
    <div className="search">
      <input type="text" placeholder="搜索一下(⊙o⊙)…" onInput={inputWord} />
      <span onClick={() => push(`/search/${word}`)}>
        <i className="icon-font icon-search"></i>
      </span>
    </div>
  )
}

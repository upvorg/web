import { axios } from '@web/shared'
import { useEffect, useRef, useState } from 'react'
import ListSection from '../../components/list-section'
import './index.scss'

export default function SearchPage() {
  const urlSearchParams = new URLSearchParams(window.location.search)
  const queryParams = Object.fromEntries(urlSearchParams.entries())
  const inputKeyword = useRef('')
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const k = inputKeyword.current || queryParams.keyword

    if (k) {
      document.title = `${k} - 搜索`
      axios.get(`/search/posts?key=${k}`).then((res) => {
        setPosts(res.data)
      })
    }
  }, [])

  return (
    <div className="search">
      <div className="search-header">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            window.history.replaceState(null, '', `?keyword=${inputKeyword.current}`)
          }}
        >
          <div className="search-wrap">
            {/* <span className="search-logo"></span> */}
            <div className="search-action">
              <input
                id="search-input"
                type="text"
                maxLength={100}
                autoComplete="off"
                defaultValue={queryParams.keyword}
                onChange={(e) => (inputKeyword.current = e.target.value)}
              />
            </div>
            <button className="button is-primary">搜索</button>
          </div>
        </form>
      </div>
      <div className="search-body">
        <ListSection title="搜索结果" videos={posts} />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import ListSection from '../../components/list-section'
import RankList from '../../components/rank-list'
import { axios } from '@web/shared'

export default function IndexPage() {
  const st = ['推荐', '最新', '原创']
  const [state, setState] = useState<any[][]>([])
  const [rankList, setRankList] = useState([])

  useEffect(() => {
    Promise.allSettled([
      axios.get('/posts?status=3&tag=推荐&page=1&pageSize=10&type=video'),
      axios.get('/posts?status=3&sort=bgm&page=1&pageSize=10&type=video'),
      axios.get('/posts?status=3&sort=原创&page=1&pageSize=10&type=video'),
      axios.get(`/rank`)
    ]).then((_resp) => {
      const resp = _resp.map(
        (item) => (item as PromiseFulfilledResult<UPV.R.Response>)?.value?.data ?? []
      )
      setRankList(resp.pop())
      setState(resp)
    })
  }, [])

  return (
    <>
      {state.map((item, index) => {
        if (index == 0) {
          return (
            <ListSection
              key={index}
              title={st[index]}
              videos={item}
              aside={<RankList list={rankList} />}
              asideTitle="排行榜"
            />
          )
        }
        return <ListSection key={index} title={st[index]} videos={item} />
      })}
    </>
  )
}

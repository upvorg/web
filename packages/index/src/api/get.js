import { isDev } from 'public/js/const'
import { get } from '../public/js/fetch'

const prefix = isDev ? '//localhost:8080' : '//64.227.101.251:8080'

export function getPost(type, tag, page, pageSize, uid, t = '') {
  return get(
    `${prefix}/posts?status=3&sort=${type}&tag=${tag}&uid=${
      uid || ''
    }&page=${page}&pageSize=${pageSize}&t=${t}`
  )
}

export function getRank() {
  return get(`${prefix}/rank`)
}

export function getPostDetail(pid) {
  return get(`${prefix}/post/${pid}`)
}

export function getVideoList(pid) {
  return get(`${prefix}/videos?pid=${pid}&page=1&pageSize=150`)
}

export function getPlayUrl(url) {
  return get(`${prefix}/jx?url=${url}`)
}

export function getPv(pid) {
  return get(`${prefix}/pv/${pid}`)
}

export function getSearch(key) {
  return get(`${prefix}/search/posts?key=${key}`)
}

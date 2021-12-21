// @ts-nocheck
import { stringifyQuery } from 'vue-router'
import { getLocalToken, setLocalToken } from './localstorage'
import r from '../router'
import emitter from './emitter'

export const perfix = __DEV__ ? `//127.0.0.1:8080` : '//64.227.101.251:8080'

export function getPost(id) {
  return get(`${perfix}/post/${id}`)
}

export function add({ title, content, status, sort, tag, uid, videos }) {
  return post(`${perfix}/post/add`, {
    title,
    content,
    status,
    sort,
    tag,
    uid: parseInt(uid),
    videos,
  })
}

export function update({ id, title, content, status, sort, tag, uid, time, videos }) {
  return post(`${perfix}/post/update/${id}`, {
    title,
    content,
    status,
    sort,
    tag,
    uid: parseInt(uid),
    time,
    videos,
  })
}

export function login({ name, pwd }) {
  return post(`${perfix}/user/login`, {
    name,
    pwd,
  })
}

export function register(name, pwd, qq) {
  return post(`${perfix}/user/register`, {
    name,
    pwd,
    qq,
  })
}

export function getUser(uname, uid, uqq) {
  return get(`${perfix}/user?uanme=${uname}&uid=${uid}&uqq=${uqq}`)
}

export function getUsers(key, level, page, pageSize, order = '') {
  return get(
    `${perfix}/users?name=${key}&level=${level}&order=${order}&page=${page}&pageSize=${pageSize}`
  )
}

export function updateUser({ id, name, pwd, qq, level, desc, status, bio, avatar }) {
  return post(`${perfix}/user/update/${id}`, {
    name,
    pwd,
    qq,
    level: parseInt(level),
    desc,
    status,
    bio,
    avatar,
  })
}

export function getPosts(status, sort, tag, uid, page, pageSize, order, key) {
  return get(
    `${perfix}/posts?${stringifyQuery({
      status,
      sort,
      tag,
      uid,
      page,
      pageSize,
      order,
      key,
    })}`
  )
}

export function deletePost(id) {
  return post(`${perfix}/post/delete/${id}`)
}

export function deletePostByIds(ids: number[]) {
  return post(`${perfix}/user/deletePostByIds`, ids)
}

export function deleteUser(id) {
  return post(`${perfix}/user/delete/${id}`)
}

export function deleteUserByIds(ids: number[]) {
  return post(`${perfix}/user/deleteUserByIds`, ids)
}

export function getVideos(pid, page = 1, pageSize = 299) {
  return get(
    `${perfix}/videos?${stringifyQuery({
      pid: pid,
      page,
      pageSize,
    })}`
  )
}

export function updateVideo(id, params: { pid; title; content; oid; uid }) {
  return post(`${perfix}/video/update/${id}`, params)
}

export function deleteVideo(id, pid) {
  return post(`${perfix}/video/delete?${stringifyQuery({ id, pid })}`)
}

/****** */

function check(data) {
  emitter.emit('loading', false)
  if (data?.msg) {
    emitter.emit('alert', {
      type: data.code === 200 ? 'success' : 'warning',
      text: data.msg,
    })
  }
  if (data?.code === 401) {
    setLocalToken('')
    r.replace('/login')
  } else if (data?.code === 200) {
    return data
  } else {
    console.log(`[${data?.code}]: ${data?.msg}`)
    throw Error(`[${data?.code}]: ${data?.msg}`)
  }
}

export function post(url, data = {}) {
  emitter.emit('loading', true)
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: getLocalToken(),
    },
    credentials: 'include',
  })
    .then((res: Response) => {
      if (res.status === 401) {
        setLocalToken('')
        r.replace('/login')
      }
      return res.json()
    })
    .then((res) => check(res))
    .catch((_) => {
      emitter.emit('loading', false)
    })
}

export function get(url) {
  emitter.emit('loading', true)
  return fetch(url, {
    headers: { Authorization: getLocalToken() },
    credentials: 'include',
  })
    .then((res) => {
      if (res.status === 401) {
        setLocalToken('')
        r.replace('/login')
      }
      return res.json()
    })
    .then((res) => check(res))
    .catch((_) => {
      emitter.emit('loading', false)
    })
}

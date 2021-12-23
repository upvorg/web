import { stringifyQuery } from 'vue-router'
import { GlobalState, removeLocalUser } from './localstorage'
import emitter from './emitter'
import r from '../router'
import shared from '@web/shared'

export const perfix = __DEV__ ? `http://127.0.0.1:8080` : '//64.227.101.251:8080'

type BaseResponse = {
  code: number
  msg?: string
  data: any
}

const instance = shared.http.create<BaseResponse>(perfix)

instance.interceptors.request.use((config) => {
  return {
    ...config,
    ...(GlobalState.token && {
      Authorization: GlobalState.token
    })
  }
})

instance.interceptors.response.use(
  (data) => {
    if (data?.msg) {
      emitter.emit('alert', {
        type: 'success',
        text: data.msg
      })
    }
    return data
  },
  (res) => {
    res.msg &&
      emitter.emit('alert', {
        type: 'warning',
        text: res.msg
      })
    if (res.status === 401) {
      removeLocalUser()
      r.replace('/login')
      throw new Error('401')
    }
    return res
  }
)

export const post = (url: string, data?: any) => instance.post(url, { data })

export const get = (url: string, data?: any) => instance.get(url, { data })

export function uploadApi(data: FormData) {
  emitter.emit('loading', true)
  return fetch(`${perfix}/upload`, {
    method: 'POST',
    body: data,
    headers: {
      Authorization: GlobalState.token
    }
  })
    .then((_) => _.json())
    .then((_) => perfix + '/' + _.data)
    .finally(() => {
      emitter.emit('loading', false)
    })
}

export function getPost(id: any) {
  return get(`/post/${id}`)
}

export function add(params: any) {
  return post(`/post/add`, params)
}

export function update({ id, ...params }: any) {
  return post(`/post/update/${id}`, params)
}

export function login({ name, pwd }: any) {
  return post(`/user/login`, {
    name,
    pwd
  })
}

export function register(name: any, pwd: any, qq: any) {
  return post(`/user/register`, {
    name,
    pwd,
    qq
  })
}

export function getUser(uname: any, uid: any, uqq: any) {
  return get(`/user?uanme=${uname}&uid=${uid}&uqq=${uqq}`)
}

export function getUsers(key: any, level: any, page: any, pageSize: any, order = '') {
  return get(`/users?name=${key}&level=${level}&order=${order}&page=${page}&pageSize=${pageSize}`)
}

export function updateUser({ id, ...params }: any) {
  return post(`/user/update/${id}`, params)
}

export function getPosts(status: any, sort: any, tag: any, uid: any, page: any, pageSize: any, order: any, key: any) {
  return get(
    `/posts?${stringifyQuery({
      status,
      sort,
      tag,
      uid,
      page,
      pageSize,
      order,
      key
    })}`
  )
}

export function deletePost(id: any) {
  return post(`/post/delete/${id}`)
}

export function deletePostByIds(ids: number[]) {
  return post(`/user/deletePostByIds`, ids)
}

export function deleteUser(id: any) {
  return post(`/user/delete/${id}`)
}

export function deleteUserByIds(ids: number[]) {
  return post(`/user/deleteUserByIds`, ids)
}

export function getVideos(pid: any, page = 1, pageSize = 222) {
  return get(
    `/videos?${stringifyQuery({
      pid: pid,
      page,
      pageSize
    })}`
  )
}

export function updateVideo(id: any, params: { pid: any; title: any; content: any; oid: any; uid: any }) {
  return post(`/video/update/${id}`, params)
}

export function deleteVideo(id: any, pid: any) {
  return post(`/video/delete?${stringifyQuery({ id, pid })}`)
}

/****** */

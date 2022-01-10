import router from '../router'
import { TOKEN_KEY, USER_KEY } from '../constant'

const ls = {
  get(k: string) {
    return localStorage.getItem(k)
  },
  set(k: string, v: string) {
    localStorage.setItem(k, v)
  },
  rm(k: string) {
    localStorage.removeItem(k)
  }
}

export type User = {
  id: number
  level: number
  name: string
  create_time: string
  update_time: string
  status: number
  bio: string
  avatar: string
  qq: string
}

export const GlobalState = {
  user: {} as User | null,
  token: ''
}

export const getLocalToken = () => ls.get(TOKEN_KEY)
export const setLocalToken = (v: string) => ls.set(TOKEN_KEY, v)

export const getLocalUser = (): User => {
  GlobalState.token = getLocalToken() ?? ''
  return (GlobalState.user = JSON.parse(ls.get(USER_KEY) || '{}'))
}

export const setLocalUser = (v: object) => ls.set(USER_KEY, JSON.stringify(v))

export const removeLocalUser = () => {
  ls.rm(USER_KEY)
  ls.rm(TOKEN_KEY)
  GlobalState.user = {} as User
  GlobalState.token = ''
}

export const logout = () => {
  removeLocalUser()
  router.push({ path: '/login', replace: true })
}

export default ls

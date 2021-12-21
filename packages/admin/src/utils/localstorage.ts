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
  },
}

type User = {
  id: number
  level: number
  name: string
}

export const GlobalState: { user: User | null } = {
  user: null,
}

export const getLocalToken = () => ls.get(TOKEN_KEY)
export const setLocalToken = (v: string) => ls.set(TOKEN_KEY, v)

export const getLocalUser = (): User => {
  return (GlobalState.user = JSON.parse(ls.get(USER_KEY) || '{}'))
}

export const setLocalUser = (v: object) => ls.set(USER_KEY, JSON.stringify(v))

export const removeLocalUser = () => ls.rm(USER_KEY)

export default ls

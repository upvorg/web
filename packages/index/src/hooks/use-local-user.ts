import { LOCAL_STORAGE_USER_INFO_KEY } from '@web/shared'

export const useLocalUser = (): Record<string, string> | null => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_INFO_KEY) || 'null')
}

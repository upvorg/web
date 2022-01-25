import http from './http'

// webpack proxy
export const apiPerfix = __DEV__ ? `/api` : '//api.upv.life'
export const storgePrefix = __DEV__ ? `http://127.0.0.1:8080` : '//storge.upv.life'

export const axios = http.create<UPV.R.Response>(apiPerfix)

import http from './http'

// webpack proxy
export const apiPerfix = __API_HOST__
export const storgePrefix = __STORAGE_HOST__

export const axios = http.create<UPV.R.Response>(apiPerfix)

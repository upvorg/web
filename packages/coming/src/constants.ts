import shared from '@web/shared'

export const apiPerfix = __DEV__ ? `http://127.0.0.1:8080` : '//api.upv.life'
export const storgePrefix = __DEV__ ? `http://127.0.0.1:8080` : '//storge.upv.life'

export const axios = shared.http.create<UPV.R.Response>(apiPerfix)

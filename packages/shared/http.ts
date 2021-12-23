type Options = {
  headers?: HeadersInit
  baseUrl?: string
}

type ReqConfig = {
  data?: any
  headers?: HeadersInit
}

type requestInterceptorResolve = (config: HeadersInit) => HeadersInit
type requestInterceptorReject = (error: any) => any

class requestInterceptor {
  constructor(
    public resolve?: requestInterceptorResolve,
    public reject?: requestInterceptorReject
  ) {
    this.reject = (config) => config
    this.resolve = (error) => error
  }

  use(resolve: requestInterceptorResolve, reject?: requestInterceptorReject) {
    this.resolve = resolve
    reject && (this.reject = reject)
  }
}

type responseInterceptorResolve<T> = (res: T) => T
type responseInterceptorReject = (error: any) => any

class responseInterceptor {
  constructor(
    public resolve?: responseInterceptorResolve<any>,
    public reject?: responseInterceptorReject
  ) {
    this.reject = (config) => config
    this.resolve = (error) => error
  }

  use<T = any>(resolve: responseInterceptorResolve<T>, reject?: responseInterceptorReject) {
    this.resolve = resolve
    reject && (this.reject = reject)
  }
}

export default class Http {
  private baseUrl: string
  private headers: HeadersInit
  public interceptors: {
    request: requestInterceptor
    response: responseInterceptor
  }

  constructor(options: Options) {
    this.baseUrl = options.baseUrl ?? ''
    this.headers = options.headers ?? {}
    this.interceptors = {
      request: new requestInterceptor(),
      response: new responseInterceptor(),
    }
  }

  static create(url?: string, header?: HeadersInit) {
    return new Http({
      baseUrl: url,
      headers: header,
    })
  }

  get(url: string, { headers, data }: ReqConfig = {}) {
    return this._send(url, 'GET', headers, data)
  }

  post(url: string, { headers, data }: ReqConfig = {}) {
    return this._send(url, 'POST', headers, data)
  }

  private _send(url: string, method: string, headers: HeadersInit = {}, data: any = {}) {
    const config = this.interceptors.request.resolve?.({
      'Content-type': 'application/json; charset=UTF-8',
      ...this.headers,
      ...headers,
    })
    return fetch(`${this.baseUrl}${url}`, {
      method,
      headers: config,
      ...(['Get', 'HEAD'] && {
        data: JSON.stringify(data),
      }),
    })
      .then(
        (res: Response) => {
          if (res.ok) return res.json()

          this.interceptors.response.reject?.({
            status: res.status,
            statusText: res.statusText,
          })
          return res
        },
        (reson: any) => {
          console.log('request error' + reson)
          const returnValue = this.interceptors.request.reject?.(reson)
          return returnValue
        }
      )
      .then((response) => {
        return this.interceptors.response.resolve?.(response) ?? response
      })
  }
}

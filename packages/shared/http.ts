type Options = {
  headers?: HeadersInit
  baseUrl?: string
}

type ReqConfig = {
  data?: any
  headers?: HeadersInit
}

type requestInterceptorResolve = (config: ReqConfig) => ReqConfig
type requestInterceptorReject = (error: any) => any

class requestInterceptor {
  constructor(
    public resolve?: requestInterceptorResolve,
    public reject?: requestInterceptorReject
  ) {}

  use(resolve: requestInterceptorResolve, reject?: requestInterceptorReject) {
    this.resolve = resolve
    reject && (this.reject = reject)
  }
}

type responseInterceptorResolve = (res: Response) => Response
type responseInterceptorReject = (error: any) => any

class responseInterceptor {
  constructor(
    public resolve?: responseInterceptorResolve,
    public reject?: responseInterceptorReject
  ) {}

  use(resolve: responseInterceptorResolve, reject?: responseInterceptorReject) {
    this.resolve = resolve
    reject && (this.reject = reject)
  }
}

export default class Http {
  private baseUrl: string
  private headers: HeadersInit
  private interceptors: {
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

  get(url: string, { headers, data }: ReqConfig) {
    return this._send(url, 'GET', headers, data)
  }

  post(url: string, { headers, data }: ReqConfig) {
    return this._send(url, 'POST', headers, data)
  }

  private _send(url: string, method: string, headers: HeadersInit = {}, data: any = {}) {
    return fetch(`${this.baseUrl}${url}`, {
      method,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        ...this.headers,
        ...headers,
      },
      body: JSON.stringify(data),
    })
      .then(
        (res: Response) => {
          if (res.ok) {
            return res.json()
          }
          this.interceptors.response.reject?.({
            status: res.status,
            statusText: res.statusText,
          })
          return res
        },
        (reson: any) => {
          const returnValue = this.interceptors.request.resolve?.(reson)
          return returnValue
        }
      )
      .then((response) => {
        return this.interceptors.response.resolve?.(response) ?? response
      })
  }
}

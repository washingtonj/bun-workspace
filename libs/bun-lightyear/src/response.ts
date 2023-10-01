interface ResSendParams {
  body?: string | Record<string, any>
  headers?: Record<string, string>
  status?: number
  cookies?: Record<string, CookiesOptions>
}

interface CookiesOptions {
  value: string
  maxAge?: number
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

/**
 * A response object to be used in controllers.
 */
export class Res {
  public body?: string | Record<string, any>
  public headers: Record<string, string> = {}
  public cookies: Record<string, string> = {}
  public status: number = 200

  private convertBody (body: Res['body']): string | undefined {
    if (typeof body === 'string') {
      this.headers['content-type'] = 'text/html'
      return body
    }

    if (typeof body === 'object') {
      this.headers['content-type'] = 'application/json'
      return JSON.stringify(body)
    }

    return undefined
  }

  private setCookie (name: string, options: CookiesOptions): void {
    let cookie = `${name}=${options.value}`

    if (options.maxAge != null) cookie += `; Max-Age=${options.maxAge}`
    if (options.expires != null) cookie += `; Expires=${options.expires.toUTCString()}`
    if (options.path != null) cookie += `; Path=${options.path}`
    if (options.domain != null) cookie += `; Domain=${options.domain}`

    if (options.secure === true) cookie += '; Secure'
    if (options.httpOnly === true) cookie += '; HttpOnly'

    if (options.sameSite != null) {
      cookie += `; SameSite=${options.sameSite}`
    } else {
      cookie += '; SameSite=None'
    }

    this.headers['set-cookie'] = cookie
  }

  public send (params: ResSendParams): Response {
    const body = this.convertBody(params.body)

    if (params.headers != null) {
      for (const [name, value] of Object.entries(params.headers)) {
        this.headers[name] = value
      }
    }

    if (params.status != null) {
      this.status = params.status
    }

    if (params.cookies != null) {
      for (const [name, cookie] of Object.entries(params.cookies)) {
        this.setCookie(name, cookie)
      }
    }

    return new Response(body, { headers: this.headers, status: this.status })
  }
}

export class Req {
  public readonly url: string
  public readonly method: string
  public readonly query: Record<string, string | undefined>
  public readonly headers: Record<string, string>
  public readonly cookies: Record<string, string | undefined>
  public pathname: string
  public params: Record<string, string | undefined>

  constructor (private readonly request: Request) {
    const { pathname } = new URL(request.url)
    const { method, url, headers } = request

    this.method = method
    this.url = url
    this.pathname = pathname
    this.headers = Object.fromEntries(headers.entries())
    this.cookies = this.getCookieParams()
    this.query = this.getQueryParams()
    this.params = {}
  }

  public async json (): Promise<Record<string, any> | undefined> {
    const contentType = this.headers['content-type'] ?? ''

    if (contentType === 'application/json') {
      return await this.request.json()
    }
  }

  private getQueryParams (): Record<string, string> {
    const query: Record<string, string> = {}
    const match = this.url.match(/\?(.*)/)

    if (match != null) {
      const queryString = match[1]
      const pairs = queryString.split('&')

      pairs.forEach(pair => {
        const [key, value] = pair.split('=')
        query[key] = decodeURIComponent(value)
      })
    }

    return query
  }

  private getCookieParams (): Record<string, string> {
    const cookie: Record<string, string> = {}
    const cookieHeader = this.headers.cookie

    if (cookieHeader != null) {
      const pairs = cookieHeader.split(';')

      pairs.forEach(pair => {
        const [key, value] = pair.split('=')
        cookie[key.trim()] = decodeURIComponent(value)
      })
    }

    return cookie
  }
}

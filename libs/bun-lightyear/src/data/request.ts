export class Req {
  private readonly request: Request
  public readonly url: string
  public readonly method: string
  public readonly query: Record<string, string>
  public readonly headers: Record<string, string>
  public pathname: string
  public params: Record<string, string>

  constructor (request: Request) {
    const { pathname } = new URL(request.url)
    const { method, url, headers } = request

    this.request = request

    this.method = method
    this.url = url
    this.pathname = pathname
    this.query = this.getQueryParams()
    this.headers = Object.fromEntries(headers.entries())
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
}

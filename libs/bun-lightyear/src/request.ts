export class LightyearRequest<T = any> {
  public readonly url: string
  public readonly method: string
  public readonly query: Record<string, string>
  public readonly headers: Record<string, string>
  public pathname: string
  public params: { [key: string]: string }
  public json?: Record<string, T>

  constructor(request: Request) {
    const { pathname } = new URL(request.url)
    const { method, url, headers } = request

    this.method = method
    this.url = url
    this.pathname = pathname
    this.query = this.getQueryParams()
    this.headers = Object.fromEntries(headers.entries())
    this.params = {}

    this.transformJson(request)
  }

  private async transformJson(request: Request): Promise<void> {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      this.json = await request.json()
    }
  }

  private getQueryParams(): Record<string, string> {
    const query: Record<string, string> = {}
    const match = this.url.match(/\?(.*)/)

    
    if (match) {
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
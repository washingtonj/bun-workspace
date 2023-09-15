interface ResOptions {
  status?: number
  body?: string | Record<string, any>
  headers?: Record<string, string>
}

export class Res {
  public body?: string | Record<string, any>
  public headers: Record<string, string>
  public readonly status: number

  constructor (options: ResOptions) {
    this.body = options.body
    this.headers = options.headers ?? {}
    this.status = options.status ?? 200
  }

  toResponse (): Response {
    if (typeof this.body === 'object') {
      this.headers['content-type'] = 'application/json'
      this.body = JSON.stringify(this.body)
    }

    if (typeof this.body === 'string') {
      this.headers['content-type'] = 'text/html'
    }

    return new Response(this.body, { headers: this.headers, status: this.status })
  }
}

interface LightyearResponseOptions {
  status?: number
  body?: string | Record<string, any>
  headers?: Record<string, string>
}

export class LightyearResponse {
  public readonly body?: string | Record<string, any>
  public readonly headers: Record<string, string>
  public readonly status: number

  constructor (options: LightyearResponseOptions) {
    this.body = options.body
    this.headers = options.headers ?? {}
    this.status = options.status ?? 200
  }

  public toResponse (): Response {
    const { body, headers, status } = this

    if (typeof body === 'string') {
      return new Response(body, { headers, status })
    }

    if (typeof body === 'undefined') {
      return new Response(undefined, { headers, status })
    }

    return new Response(JSON.stringify(body), { headers, status })
  }
}

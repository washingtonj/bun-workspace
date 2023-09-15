import { type LightyearRequest, type LightyearResponse } from '..'

export type Controller = (req: LightyearRequest) => LightyearResponse

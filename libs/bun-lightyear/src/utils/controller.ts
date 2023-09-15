import type { Req, Res } from 'data'

export type Controller = (req: Req) => Res

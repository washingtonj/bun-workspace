import type { Request, Response } from '.'

export type Controller = (request: Request) => Response

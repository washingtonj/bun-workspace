import { type Res } from '../..'

export type ErrorHandler = (error: any) => Promise<Res>

import { Res } from 'bun-lightyear'
import type { ErrorHandler } from 'bun-lightyear'
import { RoomNotFoundError, UnauthorizedError, UserNotFoundError } from 'domain/errors'

export const CustomErrorHandler: ErrorHandler = async (error) => {
  switch (error.constructor) {
    case RoomNotFoundError:
      return new Res({ status: 404, body: { message: error.message } })
    case UnauthorizedError:
      return new Res({ status: 401, body: { message: error.message } })
    case UserNotFoundError:
      return new Res({ status: 404, body: { message: error.message } })
    default:
      return new Res({ status: 500, body: { message: 'Internal server error' } })
  }
}

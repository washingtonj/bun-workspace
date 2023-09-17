import type { ErrorHandler } from 'bun-lightyear'
import { RoomNotFoundError, UnauthorizedError, UserNotFoundError } from 'domain/errors'

export const CustomErrorHandler: ErrorHandler = async (error, res) => {
  switch (error.constructor) {
    case RoomNotFoundError:
      return res.send({ status: 404, body: { message: error.message } })
    case UnauthorizedError:
      return res.send({ status: 401, body: { message: error.message } })
    case UserNotFoundError:
      return res.send({ status: 404, body: { message: error.message } })
    default:
      return res.send({ status: 500, body: { message: error.message } })
  }
}

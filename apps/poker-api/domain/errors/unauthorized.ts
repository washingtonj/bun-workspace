export class UnauthorizedError extends Error {
  constructor () {
    super('User dont have permission to do this action')
  }
}

import { type Controller, Router } from 'bun-lightyear'
import { FlipCardsUseCase, VoteUseCase } from 'domain/usecases/play'
import { InMemoryRooms, InMemoryVotes } from 'infraestructure/repositories'

const voteRepository = new InMemoryVotes()
const roomRepository = new InMemoryRooms()

const router = new Router({ prefix: '/play' })

export const vote: Controller = async (req, res) => {
  const voteUseCase = new VoteUseCase(voteRepository)

  const { userId } = req.cookies
  const { roomId } = req.params
  const { value } = req.query

  const result = await voteUseCase.execute({
    userId,
    roomId,
    value
  })

  return res.send({ body: result })
}

router.route('PUT', '/:roomId/vote', vote)

export const flipCards: Controller = async (req, res) => {
  const flipCardsUseCase = new FlipCardsUseCase(voteRepository, roomRepository)

  const { userId } = req.cookies
  const { roomId } = req.params

  const result = await flipCardsUseCase.execute({
    roomId,
    userId
  })

  return res.send({ body: result })
}

router.route('POST', '/:roomId/flip', flipCards)

export default router

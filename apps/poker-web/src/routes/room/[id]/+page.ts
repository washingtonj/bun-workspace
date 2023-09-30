import { error } from '@sveltejs/kit';
import { useServices } from '$lib/hooks';
import type { PageLoad } from './$types';

interface PageContract {
  room: {
    id: string;
    name: string;
    ownerName: string;
    participants: {
      id: string;
      name: string;
    }[];
  };
  user: {
    id: string;
    name: string;
  };
}

export const load: PageLoad = async ({ params }): Promise<PageContract> => {
  const { roomService } = useServices()

  try {
    const roomInformation = await roomService.joinRoom(params.id)

    return {
      room: {
        id: roomInformation.room.id,
        name: roomInformation.room.name,
        ownerName: roomInformation.room.ownerName,
        participants: roomInformation.room.participants.map(participant => ({
          id: participant.id,
          name: participant.name
        }))
      },
      user: {
        id: roomInformation.user.id,
        name: roomInformation.user.name
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch ({ response }: any) {
    throw error(response.status, response.data.message)
  }
}
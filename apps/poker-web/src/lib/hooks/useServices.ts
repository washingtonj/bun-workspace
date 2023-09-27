import axios from 'axios'
import { RoomService } from '$lib/services'

export function useServices() {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  const roomService = new RoomService(axiosInstance);


  return { roomService };
}
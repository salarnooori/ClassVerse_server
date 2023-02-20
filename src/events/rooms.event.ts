import { Room } from '../classes/room.class'
import { ExtendedWebSocket } from '../interfaces/websocket.interface'

export const RoomsEvent = {
	name: 'ROOMS',
	handle: (
		ws: ExtendedWebSocket,
		rooms: Room[]
	):
		| {
				status: 'success'
				rooms: Omit<Room, 'creator'>[]
		  }
		| {
				status: 'failed'
				message: string
		  } => {
		if (!ws.student) {
			return {
				status: 'failed',
				message: 'Please login first',
			}
		}

		return {
			status: 'success',
			rooms: rooms.map((room) => ({
				id: room.id,
				max_student_count: room.max_student_count,
				name: room.name,
				students: room.students,
				host: room.host,
			})),
		}
	},
}

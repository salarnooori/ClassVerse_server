import { Room } from '../classes/room.class'
import { ExtendedWebSocket } from '../interfaces/websocket.interface'

export const CreateEvent = {
	name: 'CREATE',
	handle: (
		ws: ExtendedWebSocket,
		rooms: Room[],
		name: string,
		max_students_count: number
	):
		| {
				status: 'failed'
				message: string
		  }
		| {
				status: 'success'
				room: Omit<Room, 'creator'>
		  } => {
		if (!ws.student)
			return {
				status: 'failed',
				message: 'You are not logged in',
			}

		if (ws.room)
			return {
				status: 'failed',
				message: 'You already created a room',
			}

		const room = new Room(name, max_students_count, ws)
		rooms.push(room)

		ws.room = room

		return {
			status: 'success',
			room: {
				id: room.id,
				max_student_count: room.max_student_count,
				name: room.name,
				students: room.students,
				host: room.host,
			},
		}
	},
}

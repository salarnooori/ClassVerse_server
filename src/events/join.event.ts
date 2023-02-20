import { Room } from '../classes/room.class'
import { ExtendedWebSocket } from '../interfaces/websocket.interface'

export const JoinEvent = {
	name: 'JOIN',
	handle: (
		ws: ExtendedWebSocket,
		clients: Set<ExtendedWebSocket>,
		rooms: Room[],
		room_id: number
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

		const room = rooms.find((room) => room.id == room_id)

		if (!room)
			return {
				status: 'failed',
				message: 'Room not found',
			}

		const inRoomClients: ExtendedWebSocket[] = []
		clients.forEach((client) => {
			const isInRoom = room.students.some((student) => student.id == client.id)
			if (isInRoom) inRoomClients.push(client)
		})

		inRoomClients.forEach((client) => {
			client.send(
				JSON.stringify({
					event: 'STUDENT_JOINED_ROOM',
					student: ws.student,
				})
			)
		})

		room.creator.send(
			JSON.stringify({
				event: 'STUDENT_JOINED_ROOM',
				student: ws.student,
			})
		)

		room.students.push(ws.student)

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

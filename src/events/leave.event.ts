import { ExtendedWebSocket } from '../interfaces/websocket.interface'
import { Room } from '../classes/room.class'

export const LeaveEvent = {
	name: 'LEAVE',
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

		if (room) room.students.splice(room.students.indexOf(ws.student), 1)

		const inRoomClients: ExtendedWebSocket[] = []
		clients.forEach((client) => {
			const isInRoom = room.students.some((student) => student.id == client.id)
			if (isInRoom) inRoomClients.push(client)
		})

		inRoomClients.forEach((client) => {
			client.send(
				JSON.stringify({
					event: 'STUDENT_LEFT_ROOM',
					student: ws.student,
				})
			)
		})

		room.creator.send(
			JSON.stringify({
				event: 'STUDENT_LEFT_ROOM',
				student: ws.student,
			})
		)

		return { status: 'success' }
	},
}

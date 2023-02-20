import { Room } from '../classes/room.class'
import { ExtendedWebSocket } from '../interfaces/websocket.interface'

export const DeleteEvent = {
	name: 'DELETE',
	handle: (
		ws: ExtendedWebSocket,
		clients: Set<ExtendedWebSocket>,
		rooms: Room[]
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

		if (!ws.room)
			return {
				status: 'failed',
				message: 'You do not have a room',
			}

		const room = ws.room
		rooms.findIndex((room) => room.id == room.id)
		rooms.splice(
			rooms.findIndex((room) => room.id == room.id),
			1
		)

		const inRoomClients: ExtendedWebSocket[] = []
		clients.forEach((client) => {
			const isInRoom = room.students.some((student) => student.id == client.id)
			if (isInRoom) inRoomClients.push(client)
		})

		inRoomClients.forEach((client) => {
			client.send(
				JSON.stringify({
					event: 'TEACHER_DELETED_ROOM',
					student: ws.student,
				})
			)
		})

		ws.room = undefined

		return {
			status: 'success',
		}
	},
}

import { ExtendedWebSocket } from '../interfaces/websocket.interface'

export const SetHostEvent = {
	name: 'SET_HOST',
	handle: (
		ws: ExtendedWebSocket,
		clients: Set<ExtendedWebSocket>,
		student_id: number
	):
		| {
				status: 'failed'
				message: string
		  }
		| {
				status: 'success'
		  } => {
		if (!ws.student) {
			return {
				status: 'failed',
				message: 'You are not teacher',
			}
		}

		if (!ws.room) {
			return {
				status: 'failed',
				message: 'You are not in a room',
			}
		}

		const room = ws.room
		const student = room.students
			.filter((student) => student.id == student_id)
			.at(0)

		if (!student) {
			return {
				status: 'failed',
				message: 'Student not in room',
			}
		}
		room.host = student

		const inRoomClients: ExtendedWebSocket[] = []
		clients.forEach((client) => {
			const isInRoom = room.students.some((student) => student.id == client.id)
			if (isInRoom) inRoomClients.push(client)
		})

		inRoomClients.forEach((client) => {
			client.send(
				JSON.stringify({
					event: 'SET_HOST',
					student: student,
				})
			)
		})

		ws.send(
			JSON.stringify({
				event: 'SET_HOST',
				student: student,
			})
		)

		return {
			status: 'success',
		}
	},
}

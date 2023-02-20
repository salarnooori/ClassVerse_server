import { Room } from '../classes/room.class'
import { ExtendedWebSocket } from '../interfaces/websocket.interface'

export const BroadcastEvent = {
	name: 'BROADCAST',
	handle: (
		ws: ExtendedWebSocket,
		rooms: Room[],
		clients: Set<ExtendedWebSocket>,
		room_id: number,
		voice_data: string
	) => {
		const room = rooms.find((room) => room.id == room_id)
		if (!room)
			return {
				status: 'failed',
				message: 'Invalid room',
			}

		if (
			!room.students.find((student) => student.id == ws.student.id) &&
			room.creator !== ws
		)
			return {
				status: 'failed',
				message: 'Invalid room',
			}

		const inRoomClients: ExtendedWebSocket[] = []
		clients.forEach((client) => {
			const isInRoom = room.students.some((student) => student.id == client.id)
			if (isInRoom) inRoomClients.push(client)
		})

		inRoomClients.forEach((client) => {
			console.log(client.student.name)

			client.send(
				JSON.stringify({
					event: 'BROADCAST',
					voice_data: voice_data,
				})
			)
		})

		room.creator.send(
			JSON.stringify({
				event: 'BROADCAST',
				voice_data: voice_data,
			})
		)

		return {
			//status: 'success',
		}
	},
}

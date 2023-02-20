import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'

// interfaces
import { ExtendedWebSocket } from './interfaces/websocket.interface'

// classes
import { Student } from './classes/student.class'
import { Room } from './classes/room.class'

// events
import { LoginEvent } from './events/login.event'
import { CreateEvent } from './events/create.event'
import { DeleteEvent } from './events/delete.event'
import { JoinEvent } from './events/join.event'
import { LeaveEvent } from './events/leave.event'
import { RoomsEvent } from './events/rooms.event'
import { SetHostEvent } from './events/set-host.event'
import { BroadcastEvent } from './events/broadcast.event'

// initialize express application
const app = express()

// initialize http server
const server = http.createServer(app)

// initialize websocket server
const wss = new WebSocket.Server<ExtendedWebSocket>({ server })

const students: Student[] = []
const rooms: Room[] = []

wss.on('connection', (ws: ExtendedWebSocket) => {
	ws.alive = true

	ws.on('message', (message: string) => {
		const object = JSON.parse(message.toString())

		console.log('message received:', JSON.stringify(object))

		let response = {}

		switch (object.event) {
			case LoginEvent.name:
				response = LoginEvent.handle(ws, rooms, object.name, object.code)
				break
			case RoomsEvent.name:
				response = RoomsEvent.handle(ws, rooms)
				break
			case CreateEvent.name:
				response = CreateEvent.handle(
					ws,
					rooms,
					object.name,
					object.max_students_count
				)
				break
			case DeleteEvent.name:
				response = DeleteEvent.handle(ws, wss.clients, rooms)
				break
			case JoinEvent.name:
				response = JoinEvent.handle(ws, wss.clients, rooms, object.room_id)
				break
			case LeaveEvent.name:
				response = LeaveEvent.handle(ws, wss.clients, rooms, object.room_id)
				break
			case SetHostEvent.name:
				response = SetHostEvent.handle(ws, wss.clients, object.student_id)
				break
			case BroadcastEvent.name:
				response = BroadcastEvent.handle(
					ws,
					rooms,
					wss.clients,
					object.room_id,
					object.voice_data
				)
				break
		}

		console.log('response sent')

		ws.send(
			JSON.stringify({
				...response,
				event: object.event,
			})
		)
	})
})

// start server
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
	console.log('[SERVER] Started listening on port', PORT)
})

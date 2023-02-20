import { WebSocket } from 'ws'
import { Student } from '../classes/student.class'
import { Room } from '../classes/room.class'

export interface ExtendedWebSocket extends WebSocket {
	id: number
	alive: boolean
	student: Student
	room?: Room
	host: Student
}

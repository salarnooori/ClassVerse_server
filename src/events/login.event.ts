import { Room } from '../classes/room.class'
import { Student } from '../classes/student.class'
import { ExtendedWebSocket } from '../interfaces/websocket.interface'

export const LoginEvent = {
	name: 'LOGIN',
	handle: (
		ws: ExtendedWebSocket,
		rooms: Room[],
		name: string,
		code: string
	):
		| {
				status: 'failed'
				message: string
		  }
		| {
				status: 'success'
				user_id: number
				rooms: Omit<Room, 'creator'>[]
		  } => {
		if (ws.student) {
			return {
				status: 'failed',
				message: 'You are already logged in',
			}
		}

		const student = new Student(name, code)
		ws.student = student
		ws.id = student.id

		return {
			status: 'success',
			user_id: student.id,
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

import { WebSocket } from 'ws'
import { Student } from './student.class'

let room_id = 0

export class Room {
	public id: number
	public name: string
	public max_student_count: number
	public students: Student[]
	public creator: WebSocket
	public host: Student | undefined

	constructor(name: string, max_student_count: number, creator: WebSocket) {
		this.id = ++room_id
		this.name = name
		this.max_student_count = max_student_count
		this.students = []
		this.creator = creator
	}
}

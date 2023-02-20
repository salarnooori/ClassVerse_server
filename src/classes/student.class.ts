let student_id = 0

export class Student {
	public id: number
	public name: string
	public code: string

	constructor(name: string, code: string) {
		this.id = ++student_id
		this.name = name
		this.code = code
	}
}

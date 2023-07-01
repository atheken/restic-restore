export default interface Snapshot {
	time:Date
	parent: string
	tree: string
	paths:string[]
	hostname: string
	username: string
	uid:number
	gid:number
	id: string
	short_id :string
}
export interface Repo {
    Id: string
}

export interface RepoList {
    repos : Repo[]
}

export interface Snapshot{
	time: string
	parent: string
	tree: string
	paths: string[]
	hostname: string
	username: string
	uid: number
	gid: number
	id: string
	short_id: string
}
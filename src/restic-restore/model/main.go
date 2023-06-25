package model

import "time"

type Snapshot struct {
	time     time.Time `json:"time"`
	parent   string
	tree     string
	paths    []string
	hostname string
	username string
	uid      int
	gid      int
	id       string
	short_id string
}

type FileResult struct {
	name        string
	path_type   string `json:"type"`
	path        string
	uid         int
	gid         int
	mode        int
	permissions string
	mtime       time.Time
	atime       time.Time
	ctime       time.Time
	struct_type string
}

type Repo struct {
	Id string
}

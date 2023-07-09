export interface Repo {
  Id: string;
}

export interface RepoList {
  repos: Repo[];
}

export interface Snapshot {
  time: string;
  parent: string;
  tree: string;
  paths: string[];
  hostname: string;
  username: string;
  uid: number;
  gid: number;
  id: string;
  short_id: string;
}

export interface FileResult {
  name: string;
  type: string;
  path: string;
  uid: number;
  gid: number;
  mode: number;
  permissions: string;
  mtime: Date;
  atime: Date;
  ctime: Date;
  struct_type: string;
}

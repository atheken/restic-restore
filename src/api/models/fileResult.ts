export default interface FileResult {
  name: string;
  type: "file" | "dir";
  path: string;
  uid: number;
  gid: number;
  mode: number;
  permissions: string;
  mtime: Date;
  atime: Date;
  ctime: Date;
  struct_type: "node" | "snapshot";
}

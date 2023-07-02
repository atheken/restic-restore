import type Snapshot from "./snapshot"
import type SnapshotEntry from "./snapshotEntry"
import fs from "fs";
import type Repo from "./repo";
import type { Stream } from "stream";

export default class Restic {
    private static basepath = process.env?.CONFIG_PATH || "/configs"    

    static async ListRepos() : Promise<Repo[]>{
        return new Promise((resolve, reject) => {
            fs.readdir(Restic.basepath, (err, files)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(files.map(f =>{
                        return { Id: f } 
                    }))
                }
            })
        })
    }

    configPath: string;
    
    constructor(configPath: string){
        this.configPath = configPath;
    }

    async ListSnapshots(): Promise<Snapshot[]> {
        return [];
    }

    async ListFilesForSnapshot(snapshotId:string, path: string | undefined): Promise<SnapshotEntry[]> {
        return [];
    }

    async ExtractStream(snapshotId: string, path: string) : Promise<Stream>{
        throw "Restore not available"
    }

    private async QueryRestic<T>(args:string[]) : Promise<T[]> {
        return []
    }

    private async RestorePath<T>(snapshotid:string, path:string) : Promise<ReadableStream> {
        throw "not implemented"
    }
}
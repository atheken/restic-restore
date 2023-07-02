import Restic from "./models/restic"
import { randomUUID } from "crypto"
import express from "express";
import { createServer as createViteServer } from 'vite'

let app = express()

try{
    let vite = await createViteServer({
        root: "./ui",
        server : {
            base: "/app",
            middlewareMode : true,
        },
        appType : "custom"
    })

   // app.use("/app", vite.middlewares)

}catch(err){
    console.error(err);
}
//TODO: mount the static assets from svelte kit into the /ui path.

app.get("/", async (_, res) => {
    res.redirect("/app")
})

let port = parseInt(process.env?.HTTP_PORT || "8888")

app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`)
});

app.use(async (_, req,res,next)=>{
    try{
        await next(req, res);
    }catch(err){
        res.status(503, { success : false, message: err })
    }
})

app.get("/api/repos", async (req, res)=>{
    res.json(await Restic.ListRepos())
})

app.post("/api/repo", async (req, res)=>{
    //write a config to the storage path.
    throw "not implemented."
})

app.get("/api/repo/:repoid/gen-token", async (req, res) => {
    throw "not implemented"
})

app.get("/api/repo/:repoid", async(req, res) =>{
    let repoid = req.params.repoid
    let repo = new Restic(repoid)
    try {
        res.json(await repo.ListSnapshots())
    }catch(err){
        console.error(err)
        res.json({error : true, err });
    }

    //     c.JSON(200, launchRestic[model.Snapshot](config_path+"/"+c.Param("repoid"), "", "-v", "snapshots", "--json"))
})

app.get("/api/snapshot/:repoid/:snapshotid", async (req, res)=>{
    let repoid = req.params.repoid
    let snapshotid = req.params.snapshotid
    let path = req.query.path
    let repo = new Restic(repoid)
    res.json(await repo.ListFilesForSnapshot(snapshotid, path?.toString()))
});

app.get("/api/snapshot/:repoid/:snapshotid/download", async(req, res)=>{
    let repoid = req.params.repoid
    let snapshotid = req.params.snapshotid
    let path = req.query.path
    let repo = new Restic(repoid);
    res.setHeader("Content-Disposition", `attachment;${snapshotid}-${randomUUID}.tar.gz`);
    res.contentType("application/tar+gzip");
    (await repo.ExtractStream(snapshotid, path!.toString())).pipe(res)
})

// r.GET("/api/snapshot/:repoid/:snapshotid/download", func(c *gin.Context) {
//     // TODO: download the snapshot data for the specified path.
//     c.JSON(504, gin.H{
//         "msg": "not yet implemented.",
//     })
// })
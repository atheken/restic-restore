import Restic from "./restic";
import { randomUUID } from "crypto";
import express from "express";

let app = express();

let port = parseInt(process.env?.HTTP_PORT || "8888");

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

app.use(async (_, req, res, next) => {
  try {
    await next(req, res);
  } catch (err) {
    res.status(503, { success: false, message: err });
  }
});

app.get("/api/repos", async (req, res) => {
  res.json(await Restic.ListRepos());
});

app.post("/api/repo", async (req, res) => {
  //write a config to the storage path.
  throw "not implemented.";
});

app.get("/api/repo/:repoid/gen-token", async (req, res) => {
  throw "not implemented";
});

app.get("/api/repo/:repoid", async (req, res) => {
  let repoid = req.params.repoid;
  let repo = new Restic(repoid);
  try {
    res.json(await repo.ListSnapshots());
  } catch (err) {
    console.error(err);
    res.json({ error: true, err });
  }
});

app.get("/api/snapshot/:repoid/:snapshotid/info", async (req, res) => {
  let repoid = req.params.repoid;
  let snapshotid = req.params.snapshotid;
  let path = req.query.path;
  let repo = new Restic(repoid);
  res.json(await repo.Snapshot(snapshotid));
});

app.get("/api/snapshot/:repoid/:snapshotid/ls", async (req, res) => {
  let repoid = req.params.repoid;
  let snapshotid = req.params.snapshotid;
  let path = req.query.path;
  let repo = new Restic(repoid);
  let files = await repo.ListFilesForSnapshot(snapshotid, path?.toString());
  res.json(files);
});

app.get("/api/snapshot/:repoid/:snapshotid/download", async (req, res) => {
  let repoid = req.params.repoid;
  let snapshotid = req.params.snapshotid;
  let path = req.query.path.toString();
  let type = req.query.type.toString();
  let repo = new Restic(repoid);

  let name = path.split("/").pop();

  let contentType = "application/octet-stream";

  if (type == "dir") {
    name += ".tar";
    contentType = "application/tar";
  }

  let attachmentName = `${snapshotid.substring(0, 6)}-${randomUUID()
    .toString()
    .substring(0, 6)}-${name}`;

  res.setHeader(
    "Content-Disposition",
    `attachment;filename="${attachmentName}"`
  );
  res.contentType(contentType);

  (await repo.ExtractStream(snapshotid, path!.toString())).pipe(res);
});

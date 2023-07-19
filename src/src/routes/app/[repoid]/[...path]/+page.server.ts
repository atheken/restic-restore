import Restic from "$lib/Restic";

export async function load({ params }) {
  // we should handle urlencoded parts...
  let path = params.path.split("/").filter((l) => l.trim() != "");
  let restic = await Restic.Access(params.repoid);

  return { files: restic.List(path.join("/")) };
}

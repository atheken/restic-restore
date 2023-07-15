import Restic from "$lib/restic";

export async function load({ params }) {
  // we should handle urlencoded parts...
  let path = params.repo.split("/").filter((l) => l.trim() != "");
  let repo = path.shift();
  let restic = Restic.Access(repo!);

  return { files: (await restic).List(path.join("/")) };
}

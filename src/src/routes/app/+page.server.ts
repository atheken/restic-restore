import Restic from "$lib/restic";

export async function load() {
  return { repos: await Restic.ListRepos() };
}

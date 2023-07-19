import Restic from "$lib/Restic";

export async function load() {
  return { repos: await Restic.ListRepos() };
}

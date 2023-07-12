import { base } from "$app/paths";
import { writable } from "svelte/store";

interface PathItem {
  name: string;
  link: string;
}

export let stack = writable<PathItem[]>();

export default function setNav(
  repo: string | null = null,
  snapshot: string | null = null,
  path: string | null = null
) {
  let pathItems: PathItem[] = [
    {
      link: base,
      name: "Home",
    },
  ];

  if (repo) {
    pathItems.push({
      link: `${base}/${repo}`,
      name: repo,
    });
    if (snapshot) {
      pathItems.push({
        link: `${base}/${repo}/${snapshot}`,
        name: snapshot.substring(0, 6),
      });
      if (path) {
        let parts = path.replace(/(^\/)|(\/$)/, "").split("/");
        let prefix = [];
        for (let p of parts) {
          prefix.push(p);
          let s = new URLSearchParams({ path: "/" + prefix.join("/") });
          pathItems.push({
            name: p,
            link: `${base}/${repo}/${snapshot}?${s}`,
          });
        }

        //split the path up and put a link in the path for each item.
      }
    }
  }
  stack.set(pathItems);
}
setNav();

import { base } from "$app/paths";
import { writable } from "svelte/store";

interface PathItem {
  name: string;
  link: string;
}

export let stack = writable<PathItem[]>();

export const APP_PATH = `${base}`;

export default function setNav(path: string[] = []) {
  let pathItems: PathItem[] = [
    {
      link: APP_PATH,
      name: "Home",
    },
  ];

  let prefix = [];
  for (let p of path) {
    prefix.push(p);
    let current = "/" + prefix.join("/");
    pathItems.push({
      name: p,
      link: `${APP_PATH}${current}`,
    });
  }

  stack.set(pathItems);
}

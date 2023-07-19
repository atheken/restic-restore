import { base } from "$app/paths";
import { writable } from "svelte/store";

interface PathItem {
  name: string;
  link: string;
}

export let stack = writable<PathItem[]>();

export const APP_PATH = `${base}/app/`;

export function setPath(prependHome: boolean, ...path: PathItem[]) {
  if (prependHome) {
    path.unshift({
      link: APP_PATH,
      name: "Home",
    });
  }
  stack.set(path);
}

export function setNav(path: string[] = []) {
  let pathItems = [];

  let prefix = [];
  for (let p of path) {
    prefix.push(p);
    let current = "/" + prefix.join("/");
    pathItems.push({
      name: p,
      link: `${APP_PATH}${current}`,
    });
  }

  setPath(true, ...pathItems);
}

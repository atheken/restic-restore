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

export function setRepoBrowsePath(currentPath: string) {
  let segments = decodeURIComponent(currentPath.replace(/(\/$)/, "")).split(
    "/"
  );

  //The current path will include the `${base}/app/r/` route, and this is required to get the proper path here.
  let prefix = [];
  while (segments.length > 0) {
    let current = segments.shift();
    prefix.push(current);
    if (current == "r") {
      break;
    }
  }

  let pathItems = [];
  for (let p of segments) {
    prefix.push(p);
    pathItems.push({
      name: p,
      link: `${prefix.join("/")}`,
    });
  }

  setPath(true, ...pathItems);
}

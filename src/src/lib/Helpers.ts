import { base } from "$app/paths";
import ta from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

ta.addDefaultLocale(en);
let formatter = new ta("en-US");

/** Normalize times to relative values (e.g. 1 minute ago, 2 months ago, etc.) */
export let relative = (value: string | Date): string =>
  value instanceof Date
    ? formatter.format(value)
    : formatter.format(new Date(value));

/** Create an authentication url with a returnPath. */
export function authUrl(repoid: string, pathname: string) {
  return `${base}/app/auth/${repoid}?${new URLSearchParams({
    returnPath: pathname,
  })}`;
}

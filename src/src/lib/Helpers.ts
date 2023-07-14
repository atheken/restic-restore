import ta from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
ta.addDefaultLocale(en);
let formatter = new ta("en-US");

export let relative = (value: string | Date): string =>
  value instanceof Date
    ? formatter.format(value)
    : formatter.format(new Date(value));

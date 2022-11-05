import { von } from "./src";

const m = von.match(`$A-$B`, `$A$B`, {
  capitalize: ["$B"],
} as const);

const r1 = m.cast("on-click");
//    ^^ const r1: "onClick"

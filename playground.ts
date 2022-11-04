import { von } from "./src";

const m = von.match(`$A-$B`, `$A$B`);
const r1 = m.cast("on-click");

console.log({ r1 });

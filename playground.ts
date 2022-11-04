import { von } from "./src";

const m = von.match(`on-$A`, `$A`);
const r1 = m.cast("on-click");

console.log({ r1 });

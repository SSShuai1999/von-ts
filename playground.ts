import { von } from "./src";

const m = von.match(`on-$A`, `on+$A`);
const r1 = m.cast("on-click");

console.log({ r1 });

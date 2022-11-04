import { von } from "./src";

const m1 = von.match(`on-$A`, `on+$A`);
const r7 = m1.cast("on-click");
//    ^^ : "onClick"

const m2 = von.match(`on$A`, `on-$A`);
const r8 = m2.cast(r7);
//    ^^ : "onclick"

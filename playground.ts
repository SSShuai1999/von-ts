import { von } from "./src";

const input = ["true", "false", "1", "sss"] as const;
const output = [true, false, true, false] as const;

const strPattern1 = von.string().pattern(input, output);
const strPattern2 = von.string().pattern(`$A:$B`, `$A$B`);

const r1 = strPattern1.cast("sss");
const r2 = strPattern2.cast("on:click");

console.log({ r1 });
console.log({ r2 });

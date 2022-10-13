import { von } from "./src";

const input = ["true", "false", "1", "0"] as const;
const output = [true, false, true, false] as const;

const strPattern1 = von.string().pattern(input, output);
const strPattern2 = von.string().pattern(`$B_$A`, `$B_$A`);

const r1 = strPattern1.cast("1");
const r2 = strPattern2.cast("0");

// console.log({ r1 });
console.log({ r2 });

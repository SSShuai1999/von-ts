import { von } from "./src";

// const strPattern1 = von.string().pattern({
//   input: ["true", "false", "1", "0"],
//   output: [true, false, true, false],
// } as const);

// const input = `$B_$A`
// const output = `$B_$A`

const strPattern2 = von.string().pattern(`$B_$A`, `$B_$A`);

// const r1 = strPattern1.cast("0");
const r2 = strPattern2.cast("0");

// console.log({ r1 });
console.log({ r2 });

import { von, C } from "./src";

// const input = ["true", "false", "1", "sss"] as const;
// const output = [true, false, true, false] as const;

// const strPattern1 = C.string().pattern(input, output);
// const strPattern2 = C.string().pattern(`on$A`, `on@U$A`);
// const strPattern3 = C.string().pattern(`$A:$B:$C`, `@L$A-@L$B-@L$C`);

// const r1 = strPattern1.cast("sss");
// const r2 = strPattern2.cast("onclick");
// const r3 = strPattern3.cast("Hello:World:Ssshuai1999");

const input2 = ["true", 1, "false", "1", "sss"] as const;
const output2 = [true, 2, false, true, false] as const;
const M1 = von.match(input2, output2);
const M2 = von.match(`$A_$B`, `++$B_+$A`);

const r1 = M1.cast("sss");
const r2 = M2.cast("hello_world");

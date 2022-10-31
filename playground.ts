import { von } from "./src";

const input2 = ["true", 1, "false", "1", "sss"] as const;
const output2 = [true, 2, false, true, false] as const;
const M1 = von.match(input2, output2);
const M2 = von.match(`@$A_$B!!`, `$A!!!$B`);

const r1 = M1.cast("sss");
const r2 = M2.cast("@Hello_World!!");
console.log({ r1, r2 });

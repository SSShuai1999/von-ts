import { von } from "./src";

const m1 = von.match(`$A-$B`, `$A$B`, {
  uppercase: ["$B"], // 全部大写
} as const);

const m2 = von.match(`$A-$B`, `$A$B`, {
  capitalize: ["$A", "$B"], // 首字母大写
} as const);

const m3 = von.match(`$A-$B`, `$A$B`, {
  lowercase: ["$A", "$B"], // 全部小写
} as const);

const m4 = von.match(`$A-$B`, `$A$B`, {
  uncapitalize: ["$B"], // 首字母小写
} as const);

const r1 = m1.cast("on-click");
//    ^^ const r1: "onCLICK"

const r2 = m2.cast("on-click");
//    ^^ const r2: "OnClick"

const r3 = m3.cast("ON-CLICK");
//    ^^ const r3: "onclick"

const r4 = m4.cast("ON-CLICK");
//    ^^ const r4: "ONcLICK"

console.log({ r1, r2, r3, r4 });

import type { Object as O } from "ts-toolbelt";

export type LinkRules<
  T extends any[],
  Input extends string,
  Catch extends Record<string, any> = {},
> = T extends [
  infer R1 extends string,
  infer R2 extends string,
  ...infer R3 extends string[],
]
  ? Input extends `${R1}${infer RR1}${R2}`
    ? O.Merge<Catch, Record<R1, { left: ""; right: RR1 }>>
    : Input extends `${infer RR1}${R1}${infer RR2}${R2}`
    ? O.Merge<Catch, Record<R1, { left: RR1; right: RR2 }>>
    : Input extends `${infer RR1}${R1}${infer RR2}${R2}${infer RR3}`
    ? LinkRules<
        [R2, ...R3],
        `${R2}${RR3}`,
        O.Merge<Catch, Record<R1, { left: RR1; right: RR2 }>>
      >
    : Catch
  : T extends [infer R1 extends string]
  ? Input extends `${R1}${infer RR1}`
    ? O.Merge<Catch, Record<R1, { left: ""; right: RR1 }>>
    : Input extends `${infer RR1}${R1}`
    ? O.Merge<Catch, Record<R1, { left: RR1; right: "" }>>
    : Input extends `${infer RR1}${R1}${infer RR2}`
    ? O.Merge<Catch, Record<R1, { left: RR1; right: RR2 }>>
    : Catch
  : Catch;

function fn(num: number): void {
  if (num === 0) {
    throw "error: can't deal with 0";
  }
}

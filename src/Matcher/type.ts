import { String } from "ts-toolbelt";

export type QueryConstrType<T> = T extends any[]
  ? T[number]
  : T extends readonly any[]
  ? T[number]
  : T;

export type MatcherKeys =
  | "$A"
  | "$B"
  | "$C"
  | "$D"
  | "$E"
  | "$F"
  | "$G"
  | "$H"
  | "$I"
  | "$J"
  | "$K"
  | "$L"
  | "$M"
  | "$N"
  | "$O"
  | "$P"
  | "$Q"
  | "$R"
  | "$S"
  | "$T"
  | "$U"
  | "$V"
  | "$W"
  | "$X"
  | "$Y"
  | "$Z";

export type SI = readonly any[] | any[] | `${any}${MatcherKeys}${any}`;

type Str = "$A";
type StructSI<T extends MatcherKeys> = T;

type Lens<Str, C extends string[] = []> = Str extends `${infer R1}${StructSI<
  infer R2
>}${infer R3}`
  ? [1, R2, Lens<`${R1}${R3}`, [...C, R2]>]
  : Str extends `${StructSI<infer R1>}${infer R2}`
  ? [2, R1, Lens<`${R2}`, [...C, R1]>]
  : Str extends `${infer R1}${StructSI<infer R2>}`
  ? [3, Lens<`${R1}`, [...C, R2]>]
  : C;

export type DepSI<_SI extends SI> = _SI;

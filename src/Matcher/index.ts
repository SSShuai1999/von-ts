import type { Any, Object, List, String } from "ts-toolbelt";
import type { ArrayType } from "../typings";
import { Tail, Head, Merge } from "../typings/hepler";

export type MatcherKeysMap = [
  "$A",
  "$B",
  "$C",
  "$D",
  "$E",
  "$F",
  "$G",
  "$H",
  "$I",
  "$J",
  "$K",
  "$L",
  "$M",
  "$N",
  "$O",
  "$P",
  "$Q",
  "$R",
  "$S",
  "$T",
  "$U",
  "$V",
  "$W",
  "$X",
  "$Y",
  "$Z",
];

type MatcherKeys = MatcherKeysMap[number];

export type QueryConstrType<T extends MatcherScope<any, any, any>> =
  T["Input"] extends any[]
    ? T["Input"][number]
    : T extends readonly any[]
    ? T["Input"][number]
    : string;

export type MStr = readonly any[] | any[] | `${any}${MatcherKeys}${any}`;

export type DepMStr<_MStr extends MStr> = _MStr;

export type If<B extends Boolean, Then, Else = never> = B extends 1
  ? Then
  : Else;

type MatcherScope<I, O, C> = {
  Input: I;
  Output: O;
  Config: C;
};

// RAry = Readonly any[], MStr = a string containing a match
type ScopeType = {
  RAry: "RAry";
  MStr: "MStr";
};

// check Scope type
type CheckScopeType<Scope extends MatcherScope<any, any, any>> =
  Scope["Input"] extends readonly any[]
    ? Scope["Output"] extends readonly any[]
      ? ScopeType["RAry"]
      : never
    : Scope["Input"] extends MStr
    ? Scope["Output"] extends MStr
      ? ScopeType["MStr"]
      : never
    : never;

type ParseRAry<
  Scope extends MatcherScope<any, any, any>,
  Origin,
> = ArrayType.At<Scope["Output"], ArrayType.FindIndex<Scope["Input"], Origin>>;

type ParseMStrMap<T extends string, CT extends string[] = []> = T extends ""
  ? List.Intersect<CT, MatcherKeysMap, "<-extends">
  : T extends `$${infer R1}${infer R2}`
  ? ParseMStrMap<R2, [...CT, `$${R1}`]>
  : T extends `${infer R1}$${infer R2}${infer R3}`
  ? ParseMStrMap<`${R1}${R3}`, [...CT, `$${R2}`]>
  : T extends `${infer R1}$${infer R2}`
  ? ParseMStrMap<R1, [...CT, `$${R2}`]>
  : List.Intersect<CT, MatcherKeysMap, "<-extends">;

type LinkRules<
  T extends any[],
  Input extends string,
  Catch extends Record<string, any> = {},
> = T extends [
  infer R1 extends string,
  infer R2 extends string,
  ...infer R3 extends string[],
]
  ? Input extends `${any}${R1}${infer Del}${R2}${any}`
    ? LinkRules<[R2, ...R3], Input, Object.Merge<Catch, Record<`${R2}`, Del>>>
    : Catch
  : T extends [infer R1 extends string, infer R2 extends string]
  ? Input extends `${any}${R1}${infer Del}${R2}${any}`
    ? Object.Merge<Catch, Record<`${R2}`, Del>>
    : Catch
  : Catch;

// [PMSM, LinkR, Origin]
type AAA1 = [
  ["$A", "$B", "$C"],
  {
    $B: ":";
  },
  "sss:aaa",
];

type AA2 = String.Split<"AA:BB:CC", ":">;
type AAA = LinkRules<AAA1[0], `$A:$B--$C`>;

type ParseOriginByMStrMap<
  Scope extends MatcherScope<any, any, any>,
  PMSM extends ParseMStrMap<any, any>,
  Origin,
  LinkR = LinkRules<PMSM, Scope["Input"]>,
> = Object.Merge<
  {},
  {
    result: [PMSM, LinkR, Origin];
    aaa: PMSM extends [...infer R1 extends string[], infer R2 extends string]
      ? `${R2}` extends keyof LinkR
        ? [
            Origin extends `${infer RR1}${LinkR[`${R2}`] & string}${infer RR3}`
              ? [RR1, RR3]
              : ``,
            LinkR[`${R2}`],
          ]
        : never
      : never;
  }
>["aaa"];

type ParseMStr<
  Scope extends MatcherScope<any, any, any>,
  Origin,
  PMSM extends ParseMStrMap<any, any> = ParseMStrMap<Scope["Input"]>,
> = ParseOriginByMStrMap<Scope, PMSM, Origin>;

type MR<Scope extends MatcherScope<any, any, any>, Origin> = Any.Is<
  CheckScopeType<Scope>,
  ScopeType["RAry"],
  "equals"
> extends 1
  ? ParseRAry<Scope, Origin>
  : Any.Is<CheckScopeType<Scope>, ScopeType["MStr"], "equals"> extends 1
  ? ParseMStr<Scope, Origin>
  : never;

class Matcher<Scope extends MatcherScope<any, any, any>> {
  public input: Scope["Input"] = undefined;
  public onput: Scope["Output"] = undefined;
  public config?: Scope["Config"];

  // constructor can't be filled with self type, so use `init` function,
  init<I, O, C>(
    input: I,
    output: O,
    config?: C,
  ): Matcher<{ Input: I; Output: O; Config: C }> {
    this.input = input;
    this.onput = output;
    this.config = config;

    return this as any;
  }

  cast<Origin extends QueryConstrType<Scope>>(
    origin: Origin,
  ): MR<Scope, Origin> {
    return {} as any;
  }
}

export function match<I extends MStr, O extends DepMStr<MStr>, C>(
  input: I,
  output: O,
  config?: C,
) {
  return new Matcher().init(input, output, config);
}

export const von = {
  match,
};

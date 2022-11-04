import { Any, Object as O, List, String } from "ts-toolbelt";
import type { ArrayType } from "../typings";
import { checkCastMode, linkRules, parseMstr, parseMStrMap } from "./utils";

export const mstrLen = 2;

export const matcherKeysMap = [
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
] as const;

export type MatcherKeysMap = typeof matcherKeysMap;

export type MatcherKeys = MatcherKeysMap[number];

export type QueryConstrType<T extends MatcherScope<any, any, any>> =
  T["Input"] extends any[]
    ? T["Input"][number]
    : T extends readonly any[]
    ? T["Input"][number]
    : string;

export type MStr = `${any}${MatcherKeys}${any}`;

export type MStrMap = readonly any[] | any[] | `${any}${MatcherKeys}${any}`;

export type DepMStrMap<_MStrMap extends MStrMap> = MStrMap;

export type If<B extends Boolean, Then, Else = never> = B extends 1
  ? Then
  : Else;

export type MatcherScope<I, O, C> = {
  Input: I;
  Output: O;
  Config: C;
};

// RAry = Readonly any[], MStr = a string containing a match
export type ScopeType = {
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

type ReplaceOutput<
  PO extends Record<string, string>,
  PMSM extends ParseMStrMap<any, any>,
  Output,
> = PMSM extends [infer R1 extends string, ...infer R2 extends string[]]
  ? R1 extends keyof PO
    ? Output extends `${any}++${R1}${any}`
      ? ReplaceOutput<
          PO,
          R2,
          String.Replace<Output, `++${R1}`, Uppercase<PO[R1]>>
        >
      : Output extends `${any}+${R1}${any}`
      ? ReplaceOutput<
          PO,
          R2,
          String.Replace<Output, `+${R1}`, Capitalize<PO[R1]>>
        >
      : Output extends `${any}--${R1}${any}`
      ? ReplaceOutput<
          PO,
          R2,
          String.Replace<Output, `--${R1}`, Lowercase<PO[R1]>>
        >
      : Output extends `${any}-${R1}${any}`
      ? ReplaceOutput<
          PO,
          R2,
          String.Replace<Output, `-${R1}`, Uncapitalize<PO[R1]>>
        >
      : Output extends `${any}${R1}${any}`
      ? ReplaceOutput<PO, R2, String.Replace<Output, R1, PO[R1]>>
      : ReplaceOutput<PO, R2, Output>
    : ReplaceOutput<PO, R2, Output>
  : Output;

type _ParseOriginByMStrMap<
  PMSM extends ParseMStrMap<any, any>,
  LinkR extends LinkRules<any, any>,
  Origin extends string,
  Catch extends Record<string, any> = {},
> = PMSM extends []
  ? Catch
  : ArrayType.At<PMSM, 0> extends infer R1 extends string
  ? R1 extends keyof LinkR
    ? LinkR[R1] extends {
        left: infer Left extends string;
        right: infer Right extends string;
      }
      ? Origin extends `${Left}${infer A}${Right}${infer Other}`
        ? Right extends ""
          ? O.Merge<Catch, Record<R1, `${A}${Other}`>>
          : _ParseOriginByMStrMap<
              List.Remove<PMSM, 0, 0>,
              LinkR,
              Other,
              O.Merge<Catch, Record<R1, A>>
            >
        : never
      : Catch
    : O.Merge<Catch, Record<R1, Origin>>
  : Catch;

type ParseOriginByMStrMap<
  Scope extends MatcherScope<any, any, any>,
  PMSM extends ParseMStrMap<any, any>,
  Origin extends string,
  LinkR extends LinkRules<any, any> = LinkRules<PMSM, Scope["Input"]>,
> = _ParseOriginByMStrMap<PMSM, LinkR, Origin>;

type ParseMStr<
  Scope extends MatcherScope<any, any, any>,
  Origin,
  PMSM extends ParseMStrMap<any, any> = ParseMStrMap<Scope["Input"]>,
> = ReplaceOutput<
  ParseOriginByMStrMap<Scope, PMSM, Origin & string>,
  PMSM,
  Scope["Output"]
>;

type MR<Scope extends MatcherScope<any, any, any>, Origin> = Any.Is<
  CheckScopeType<Scope>,
  ScopeType["RAry"],
  "equals"
> extends 1
  ? ParseRAry<Scope, Origin>
  : Any.Is<CheckScopeType<Scope>, ScopeType["MStr"], "equals"> extends 1
  ? ParseMStr<Scope, Origin>
  : never;

export class Matcher<Scope extends MatcherScope<any, any, any>> {
  public input: Scope["Input"] = undefined;
  public output: Scope["Output"] = undefined;
  public config?: Scope["Config"];

  // constructor can't be filled with self type, so use `init` function,
  init<I, O, C>(
    input: I,
    output: O,
    config?: C,
  ): Matcher<{ Input: I; Output: O; Config: C }> {
    this.input = input;
    this.output = output;
    this.config = config;

    return this as any;
  }

  cast<Origin extends QueryConstrType<Scope>>(
    origin: Origin,
  ): MR<Scope, Origin> {
    const mode = checkCastMode(this);

    if (mode === "MStr") {
      return this.#castMStr(origin as MStr) as MR<Scope, Origin>;
    }

    if (mode === "RAry") {
      return this.#castRAry(origin) as MR<Scope, Origin>;
    }

    return { error: new Error("Parse Error") } as MR<Scope, Origin>;
  }

  #castMStr(origin: MStr) {
    const mstrList = parseMStrMap(this.input, origin);
    const lRules = linkRules(mstrList, this.input);
    const parserResult = parseMstr(lRules, origin);

    let result = this.output;
    mstrList.forEach((item) => {
      if (result.includes(`++${item}`)) {
        result = result.replaceAll(
          `++${item}`,
          parserResult[item].toUpperCase(),
        );
      } else if (result.includes(`+${item}`)) {
        const head = parserResult[item].slice(0, 1);
        const tail = parserResult[item].slice(1);
        result = result.replaceAll(`+${item}`, head.toUpperCase() + tail);
      } else if (result.includes(`--${item}`)) {
        result = result.replaceAll(
          `--${item}`,
          parserResult[item].toLowerCase(),
        );
      } else if (result.includes(`-${item}`)) {
        const head = parserResult[item].slice(0, 1);
        const tail = parserResult[item].slice(1);
        result = result.replaceAll(`-${item}`, head.toLowerCase() + tail);
      } else {
        result = result.replaceAll(item, parserResult[item]);
      }
    });

    return result;
  }

  #castRAry<T>(origin: T): Scope["Output"][number] {
    const foundIndex = this.input.findIndex((item: any) => item === origin);

    if (foundIndex === -1) {
      return undefined;
    } else {
      return this.output.at(foundIndex);
    }
  }
}

export function match<I extends MStrMap, O extends DepMStrMap<MStrMap>, C>(
  input: I,
  output: O,
  config?: C,
) {
  return new Matcher().init(input, output, config);
}

export const von = {
  match,
};

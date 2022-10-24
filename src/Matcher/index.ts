import type { Any } from "ts-toolbelt";
import type { ArrayType } from "../typings";

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

export type QueryConstrType<T> = T extends any[]
  ? T[number]
  : T extends readonly any[]
  ? T[number]
  : T;

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

type ParseMStr<Scope extends MatcherScope<any, any, any>, Origin> = "ParseMStr";

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

  cast<Origin extends QueryConstrType<Scope["Input"]>>(
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

import { PrimitivesKeys, GetPrimitivesByKey } from "../helper";
import { ArrayType } from "../typings";
import { type String, type List, type Object } from "ts-toolbelt";

export type ConverterScope<A, B> = {
  input?: A;
  output?: B;
  type: PrimitivesKeys;
};

export type PatternIOType = Readonly<any[]> | string;

export type NarrowInputOutput<Scope extends ConverterScope<unknown, unknown>> =
  {
    input: Readonly<GetPrimitivesByKey<Scope["type"]>[]>;
    output: unknown;
  };

// export type NarrowInputOutput<Scope extends ConverterScope<unknown, unknown>> =
//   {
//     input: Scope["input"];
//     output: Scope["output"];
//   };

export type Pattern<
  Scope extends ConverterScope<unknown, unknown>,
  Input extends PatternIOType,
  Output extends PatternIOType,
> = Object.Merge<Scope, { input: Input; output: Output }>;

export type CastStringList<
  Origin,
  Scope extends ConverterScope<unknown, unknown>,
> = Scope["input"] extends Readonly<any[]>
  ? Scope["output"] extends Readonly<any[]>
    ? Origin extends Scope["input"][number]
      ? ArrayType.At<
          Scope["output"],
          ArrayType.FindIndex<Scope["input"], Origin>
        >
      : string
    : string
  : string;

export type CastStringString<
  Origin extends string,
  Scope extends ConverterScope<unknown, unknown>,
> = Scope["input"] extends string
  ? Scope["output"] extends string
    ? CorrelationByPattern<
        GetPatternMode<Scope["input"]>["IL"],
        UsePatternModeParse<GetPatternMode<Scope["input"]>, Origin>
      >
    : string
  : string;

type Res = {
  $A: "1";
  $B: "2";
};

type OP = `$B_$A`;

type RepleaceByPattern<
  Res extends Record<string, any>,
  OP extends string,
  Catch extends any[] = ["", ""],
> = Catch[0] extends keyof Res
  ? RepleaceByPattern<
      Res,
      OP extends `${infer _ extends Catch[0]}${infer R2}` ? R2 : "",
      ["", `${Catch[1]}${Res[Catch[0]]}`]
    >
  : OP extends `${infer R1}${infer R3}`
  ? RepleaceByPattern<Res, R3, [`${Catch[0]}${R1}`, Catch[1]]>
  : [OP, Catch];

// type AAA = String.Replace<"$A_$B", '$A', 'a'>
// type BBB = String.Split<"$A_$B", "_">;
// type CCC = String.Split<"$B_$A", "_">;

type UsePatternModeParse<
  Pattern extends { IL: string[]; Del: string[] },
  Origin extends string,
> = String.Split<Origin, ArrayType.At<Pattern["Del"], 0>>;

type CorrelationByPattern<
  Pattern extends Readonly<string[]>,
  ParserResult extends Readonly<string[]>,
  Res extends Record<any, any> = {},
> = Pattern extends Readonly<
  [infer PR1 extends string, ...infer PR2 extends string[]]
>
  ? ParserResult extends Readonly<
      [infer PR3 extends string, ...infer PR4 extends string[]]
    >
    ? CorrelationByPattern<PR2, PR4, Object.Merge<Res, Record<PR1, PR3>>>
    : Res
  : Res;

type GetPatternMode<
  Origin extends string,
  IL extends any[] = [],
  Del extends any[] = [],
> = Origin extends `${infer R3}$${infer R1}${infer R2}`
  ? GetPatternMode<
      R2,
      [...IL, `$${R1}`],
      IL["length"] extends 0 ? [] : [...Del, R3]
    >
  : { IL: IL; Del: Del };

type StringAndListParams<Scope extends ConverterScope<unknown, unknown>> =
  Scope["type"] extends "string"
    ? Scope["input"] extends Readonly<any[]>
      ? Scope["output"] extends Readonly<any[]>
        ? true
        : false
      : false
    : false;

type StringAndStringParams<Scope extends ConverterScope<unknown, unknown>> =
  Scope["type"] extends "string"
    ? Scope["input"] extends string
      ? Scope["output"] extends string
        ? true
        : false
      : false
    : false;

export type CastRetType<
  Origin extends string,
  Scope extends ConverterScope<unknown, unknown>,
> = true extends StringAndListParams<Scope>
  ? CastStringList<Origin, Scope>
  : true extends StringAndStringParams<Scope>
  ? CastStringString<Origin, Scope>
  : never;

import { PrimitivesKeys, GetPrimitivesByKey, Sub, Head, Tail } from "../helper";
import { ArrayType } from "../typings";
import { String, type List, type Object } from "ts-toolbelt";

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
    ? [
        RepleaceByPattern<
          Scope["output"],
          CorrelationByPattern<
            GetPatternMode<Scope["input"]>["IL"],
            UsePatternModeParse<GetPatternMode<Scope["input"]>, Origin>
          >
        >,
        Scope,
      ]
    : string
  : string;

export type InfinitySymbol = "$";

export type StringLastChar<T extends string> = Sub<
  String.Length<T>,
  1
> extends number
  ? String.At<T, Sub<String.Length<T>, 1>>
  : never;

export type ParseInfinitySymbol<
  T extends string,
  Res extends string[] = [],
> = T extends `$${infer R1}${infer R2}`
  ? ParseInfinitySymbol<R2, [...Res, `$${R1}`]>
  : T extends `${infer R1}$${infer R2}${infer R3}`
  ? ParseInfinitySymbol<`${R1}${R3}`, [...Res, `$${R2}`]>
  : Res;

type GetPrevCharBySymStr<
  Origin extends string,
  Sym extends string,
> = StringLastChar<String.Split<Origin, Sym>[0]>;

export type ParseByOrigin<
  IS extends string[],
  Input extends string,
  Origin extends string,
  Catch extends Record<string, any> = {},
> = IS extends [infer _ extends string]
  ? Object.Merge<Catch, Record<Input, Origin>>
  : IS extends [...infer R1 extends string[], infer R2 extends string]
  ? // infer current CommonDel
    GetPrevCharBySymStr<Input & string, R2> extends infer CommonDel
    ? // infer current origin Del
      Tail<String.Split<Origin, CommonDel & string>> &
        string extends infer CurOriginDel
      ? ParseByOrigin<
          R1,
          String.Split<Input & string, `${CommonDel & string}${R2}`>[0],
          String.Split<
            Origin & string,
            `${CommonDel & string}${CurOriginDel & string}`
          >[0],
          Object.Merge<Catch, Record<R2, CurOriginDel>>
        >
      : Catch
    : Catch
  : Catch;

type Temp = {
  type: "string";
  input: "$a_$b:$c";
  output: "on$A";
};

type TT6 = ["$A"] extends [infer R1] ? R1 : never;
type TempOrigin = "click_h1:handler";
type TT3 = ParseByOrigin<T1, Temp["input"], TempOrigin>;
type TT4 = StringLastChar<String.Split<Temp["input"] & string, `$C`>[0]>;

type T1 = ParseInfinitySymbol<Temp["input"]>;
type T2 = String.Split<Temp["input"], "$C">;
type T3 = "$A_$B:";
type GG = StringLastChar<T3>;
type T4 = String.Split<T3, "$B">;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type RepleaceByPattern<
  OP extends string,
  Res extends any[],
  Idx extends number[] = [],
  D extends Prev[number] = 4,
> = [D] extends [never]
  ? never
  : Res[Idx["length"]][0] extends undefined
  ? never
  : String.Replace<OP, Res[Idx["length"]][0], Res[Idx["length"]][1]>;

type UsePatternModeParse<
  Pattern extends { IL: string[]; Del: string[] },
  Origin extends string,
> = String.Split<Origin, ArrayType.At<Pattern["Del"], 0>>;

type CorrelationByPattern<
  Pattern extends Readonly<string[]>,
  ParserResult extends Readonly<string[]>,
  Res extends any[] = [],
> = Pattern extends Readonly<
  [infer PR1 extends string, ...infer PR2 extends string[]]
>
  ? ParserResult extends Readonly<
      [infer PR3 extends string, ...infer PR4 extends string[]]
    >
    ? CorrelationByPattern<PR2, PR4, List.Append<Res, [PR1, PR3]>>
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
  Origin,
  Scope extends ConverterScope<unknown, unknown>,
> = true extends StringAndListParams<Scope>
  ? CastStringList<Origin, Scope>
  : true extends StringAndStringParams<Scope>
  ? CastStringString<Origin & string, Scope>
  : never;

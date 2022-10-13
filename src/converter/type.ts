import { Merge, PrimitivesKeys, GetPrimitivesByKey } from "../helper";
import { ArrayType } from "../typings";
import { type String, List } from "ts-toolbelt";

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
> = Merge<Scope, { input: Input; output: Output }>;

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
  Origin,
  Scope extends ConverterScope<unknown, unknown>,
> = Scope["input"] extends string
  ? Scope["output"] extends string
    ? any
    : string
  : string;

// type AAA = String.Replace<"$A_$B", '$A', 'a'>
// type BBB = String.Split<"$A_$B", "_">;
// type CCC = String.Split<"$B_$A", "_">;

// type T1 = GetPatternItem<"$A_$B">;
// type T2 = GetPatternItem<"$B_$A">;

// type AAAA = "我_是";

// type UsePattern<PatternItem extends string, Del extends string> = String.Split<
//   PatternItem,
//   Del
// >;

// type T3 = UsePattern<"$A_$B", T1['Del'][number]>;

type GetPatternItem<
  Origin extends string,
  IL extends string[] = [],
  Del extends string[] = [],
> = Origin extends `${infer R3}$${infer R1}${infer R2}`
  ? GetPatternItem<
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
  ? CastStringString<Origin, Scope>
  : never;

import { Merge, PrimitivesKeys, GetPrimitivesByKey } from "../helper";
import { ArrayType } from "../typings";

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

export type CasetStringList<
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

export type CastRetType<
  Origin,
  Scope extends ConverterScope<unknown, unknown>,
> = Scope["type"] extends "string" ? CasetStringList<Origin, Scope> : never;

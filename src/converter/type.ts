import { Merge, PrimitivesKeys, StrToPrimitives } from "../helper";
import { ArrayType } from "../typings";

export type ConverterScope<A, B> = {
  input?: A;
  output?: B;
  type: PrimitivesKeys;
};

export type NarrowInputOutput<Scope extends ConverterScope<unknown, unknown>> =
  {
    input: Readonly<StrToPrimitives<Scope["type"]>[]>;
    output: unknown;
  };

export type Pattern<
  Scope extends ConverterScope<unknown, unknown>,
  Value extends NarrowInputOutput<Scope>,
> = Merge<Scope, { input: Value["input"]; output: Value["output"] }>;

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

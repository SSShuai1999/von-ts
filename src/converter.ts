import { Merge, PrimitivesStr, StrToPrimitives } from "./helper";
import { type ArrayType } from "./typings";

export type ConverterScope<A, B> = {
  input?: A;
  output?: B;
  type: PrimitivesStr;
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

export function pattern<T extends ConverterScope<unknown, unknown>>(
  props: T,
): Converter<T> {
  const { input, output } = props;

  return new Converter({
    input,
    output,
  } as any);
}

export class Converter<Scope extends ConverterScope<unknown, unknown>> {
  private _input: Scope["input"] = undefined;
  private _output: Scope["output"] = undefined;
  private _type: Scope["type"];

  constructor(props: Scope) {
    this._type = props.type;
  }

  public pattern<Value extends NarrowInputOutput<Scope>>(
    value: Value,
  ): Converter<Pattern<Scope, Value>> {
    this._input = value.input;
    this._output = value.output;

    return this as any;
  }

  public cast<Origin extends StrToPrimitives<Scope["type"]>>(
    origin: Origin,
  ): CastRetType<Origin, Scope> {
    const input = this.getInp() as any[];
    const output = this.getOut() as any[];
    const idx = input.findIndex((item) => item === origin);

    if (!idx) {
      return origin as CastRetType<Origin, Scope>;
    }

    return output[idx];
  }

  public getType() {
    return this._type;
  }

  public getInp() {
    return this._input;
  }

  public getOut() {
    return this._output;
  }
}

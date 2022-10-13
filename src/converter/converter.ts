import { GetPrimitivesByKey } from "../helper";
import { CastRetType, ConverterScope, Pattern, PatternIOType } from "./type";

export class Converter<Scope extends ConverterScope<unknown, unknown>> {
  private _input: Scope["input"] = undefined;
  private _output: Scope["output"] = undefined;
  private _type: Scope["type"];

  constructor(props: Scope) {
    this._type = props.type;
  }

  public pattern<Input extends PatternIOType, Output extends PatternIOType>(
    input: Input,
    output: Output,
  ): Converter<Pattern<Scope, Input, Output>> {
    this._input = input;
    this._output = output;

    return this as any;
  }

  public cast<Origin extends GetPrimitivesByKey<Scope["type"]>>(
    origin: Origin,
  ): CastRetType<Origin, Scope> {
    const input = this.getInp() as any[];
    const output = this.getOut() as any[];
    const idx = input.findIndex((item) => item === origin);

    if (idx < 0) {
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

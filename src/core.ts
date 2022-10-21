import { Converter } from "./converter/converter";
import { DepSI, QueryConstrType, SI } from "./Matcher/type";

export function to_string(): Converter<{ type: "string" }> {
  return new Converter({
    type: "string",
  });
}

export function to_number(): Converter<{ type: "number" }> {
  return new Converter({
    type: "number",
  });
}

export function to_boolean(): Converter<{ type: "boolean" }> {
  return new Converter({
    type: "boolean",
  });
}

type MatcherScope<I, O, C> = {
  Input: I;
  Output: O;
  Config: C;
};

type MR<Scope extends MatcherScope<any, any, any>, Origin> = Scope;

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

    return this;
  }

  cast<Origin extends QueryConstrType<Scope["Input"]>>(
    origin: Origin,
  ): MR<Scope, Origin> {
    return {} as any;
  }
}

export function match<I extends SI, O extends DepSI<SI>, C>(
  input: I,
  output: O,
  config?: C,
) {
  return new Matcher().init(input, output, config);
}

export const von = {
  string: to_string,
  number: to_number,
  boolean: to_boolean,
  match,
};

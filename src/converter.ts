import { PrimitivesStr, Special, StrToPrimitives } from "./helper";

export type ConverterScope<A> = {
  output: A;
};

export type CastRetType<A, B> = A extends Special
  ? B
  : A extends PrimitivesStr
  ? StrToPrimitives<A>
  : never;

export class Converter<
  T extends { output: unknown },
  Scope extends ConverterScope<T["output"]> = ConverterScope<T["output"]>,
> {
  private output: Scope["output"];

  constructor({ output }: T) {
    this.output = output;
  }

  cast<B>(from: B): CastRetType<Scope["output"], B> {
    switch (this.output) {
      case "string":
        return String(from) as any;
      case "number":
        return Number(from) as any;
      case "boolean":
        return Boolean(from) as any;
      case "literal":
        return Boolean(from) as any;
      default:
        throw new Error("not found");
    }
  }
}

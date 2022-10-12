import { PrimitivesStr, Special, StrToPrimitives } from "./helper";

type ConverterCatch<A, B> = {
  to: A;
  from: B;
};

type CastRetType<A, B> = A extends Special
  ? B
  : A extends PrimitivesStr
  ? StrToPrimitives<A>
  : { A: A; B: B };

export class Converter<
  T extends { to: any },
  Catch extends ConverterCatch<T["to"], any> = ConverterCatch<T["to"], any>,
> {
  private to: Catch["to"];

  constructor({ to }: T) {
    this.to = to;
  }

  cast<B>(from: B): CastRetType<Catch["to"], B> {
    switch (this.to) {
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

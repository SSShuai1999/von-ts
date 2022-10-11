import { PrimitivesStr, StrToPrimitives } from "./helper";

type ConverterCatch = {
  to: PrimitivesStr;
};

export class Converter<Catch extends ConverterCatch> {
  private to: PrimitivesStr;

  constructor({ to }: any) {
    this.to = to;
  }

  cast<From>(from: From): StrToPrimitives<Catch["to"]> {
    switch (this.to) {
      case "string":
        return String(from) as any;
      case "number":
        return Number(from) as any;
      case "boolean":
        return Boolean(from) as any;
      default:
        throw new Error("not found");
    }
  }
}

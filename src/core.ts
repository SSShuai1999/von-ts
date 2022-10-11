import { Converter } from "./converter";
import { PrimitivesStr, StrToPrimitives } from "./helper";

export function def<T extends PrimitivesStr>(
  value: T,
): Converter<{
  to: T;
}> {
  return new Converter({
    to: value,
  });
}

export const von = {
  def,
};

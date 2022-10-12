import { Converter } from "./converter";
import { DefProps, PrimitivesStr } from "./helper";

export function def<T extends DefProps>(
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

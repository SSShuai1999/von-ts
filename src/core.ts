import { Converter } from "./converter";
import { DefProps, PrimitivesStr } from "./helper";

export function def<T extends DefProps>(
  value: T,
): Converter<{
  output: T;
}> {
  return new Converter({
    output: value,
  });
}

export const von = {
  def,
};

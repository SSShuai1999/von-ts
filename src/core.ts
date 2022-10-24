import type { Any, List } from "ts-toolbelt";
import { type ArrayType } from "./typings";
import { Converter } from "./converter/converter";

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

export const C = {
  string: to_string,
  number: to_number,
  boolean: to_boolean,
};

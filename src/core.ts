import { type ConverterScope, Converter } from "./converter";

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

export const von = {
  string: to_string,
  number: to_number,
  boolean: to_boolean,
};

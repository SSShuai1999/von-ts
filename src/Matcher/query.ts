import { MScope } from "./scope";

export type QueryConstrType<T extends MScope<any, any, any>> =
  T["Input"] extends any[]
    ? T["Input"][number]
    : T extends readonly any[]
    ? T["Input"][number]
    : string;

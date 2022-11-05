import { MScope } from "./scope";
import { ModeType, MStr } from "./mode";

// check Scope type
export type CheckScopeType<Scope extends MScope<any, any, any>> =
  Scope["Input"] extends readonly any[]
    ? Scope["Output"] extends readonly any[]
      ? ModeType["RAry"]
      : never
    : Scope["Input"] extends MStr
    ? Scope["Output"] extends MStr
      ? ModeType["MStr"]
      : never
    : never;

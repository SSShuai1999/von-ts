import type { MScope } from "./scope";
import type { ModeType, StrId } from "./mode";

// check Scope type
export type CheckScopeType<Scope extends MScope<any, any, any>> =
  Scope["Input"] extends readonly any[]
    ? Scope["Output"] extends readonly any[]
      ? ModeType["RoMap"]
      : never
    : Scope["Input"] extends StrId
    ? Scope["Output"] extends StrId
      ? ModeType["StrId"]
      : never
    : never;

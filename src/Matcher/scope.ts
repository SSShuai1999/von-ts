import type { StrId_All_Convert } from "./mode";

export type MScopeConfig = {
  convert?: readonly StrId_All_Convert[];
};

export type MScope<I, O, C extends MScopeConfig> = {
  Input: I;
  Output: O;
  Config: C;
};

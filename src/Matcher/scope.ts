import { MStr } from "./mode";

export type MScopeConfig = {
  conver?: {
    uppercase?: readonly MStr[];
  };
};

export type MScope<I, O, C> = {
  Input: I;
  Output: O;
  Config: C;
};

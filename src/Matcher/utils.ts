import { Matcher, type ScopeType } from "./";

export const checkCastMode = (scope: Matcher<any>): keyof ScopeType => {
  if (Array.isArray(scope.input) && Array.isArray(scope.output)) {
    return "RAry";
  } else {
    return "MStr";
  }
};

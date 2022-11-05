import { IdentifierKeys } from "./identifier";

export type MStr = `${any}${IdentifierKeys}${any}`;

export type MStrMap = readonly any[] | any[] | `${any}${IdentifierKeys}${any}`;

export type DepMStrMap<_MStrMap extends MStrMap> = MStrMap;

// RAry = Readonly any[], MStr = a string containing a match
export type ModeType = {
  RAry: "RAry";
  MStr: "MStr";
};

import type { IdentifierKeys } from "./identifier";

export type StrId = `${any}${IdentifierKeys}${any}`;

export type StrId_Upper = `++${IdentifierKeys}`;

export type StrId_Cap = `+${IdentifierKeys}`;

export type StrId_Lower = `--${IdentifierKeys}`;

export type StrId_UnCap = `-${IdentifierKeys}`;

export type StrId_All_Convert =
  | StrId_Upper
  | StrId_Cap
  | StrId_Lower
  | StrId_UnCap;

export type StrIdMap = readonly any[] | any[] | `${any}${IdentifierKeys}${any}`;

export type DepStrIdMap<_StrIdMap extends StrIdMap> = StrIdMap;

export type ModeType = {
  // readonly map
  RoMap: "RoMap";

  // string identifier
  StrId: "StrId";
};

export const MODE_TYPE: ModeType = {
  RoMap: "RoMap",
  StrId: "StrId",
};

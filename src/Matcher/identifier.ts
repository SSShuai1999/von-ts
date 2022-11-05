export const identifierLen = 2;

export const identifierKeysMap = [
  "$A",
  "$B",
  "$C",
  "$D",
  "$E",
  "$F",
  "$G",
  "$H",
  "$I",
  "$J",
  "$K",
  "$L",
  "$M",
  "$N",
  "$O",
  "$P",
  "$Q",
  "$R",
  "$S",
  "$T",
  "$U",
  "$V",
  "$W",
  "$X",
  "$Y",
  "$Z",
] as const;

export type IdentifierKeysMap = typeof identifierKeysMap;

export type IdentifierKeys = IdentifierKeysMap[number];

import type { Matcher } from "./core";
import type { ModeType, StrId } from "./mode";

import { identifierLen, identifierKeysMap } from "./identifier";

export const checkCastMode = (scope: Matcher<any>): keyof ModeType => {
  if (Array.isArray(scope.input) && Array.isArray(scope.output)) {
    return "RoMap";
  } else {
    return "StrId";
  }
};

export const parseStrIdMap = (input: StrId) => {
  const mstrList = [] as StrId[];
  identifierKeysMap.forEach((item) => {
    if (input.includes(item)) {
      mstrList.push(item);
    }
  });

  return mstrList;
};

export const linkRules = (mstrList: StrId[], input: StrId) => {
  const lRules = {} as Record<StrId, { left: string; right: string }>;

  mstrList.forEach((item, idx) => {
    const result = { left: "", right: "" };

    const of = input.indexOf(item);

    if (of !== 0) {
      result.left = input.slice(0, of);
    }

    const next = mstrList[idx + 1];
    if (next) {
      const nextOf = input.indexOf(next);
      const del = input.slice(of + identifierLen, nextOf);

      result.right = del;
    } else {
      result.right = input.slice(of + identifierLen);
    }

    lRules[item] = result;
  });

  return lRules;
};

export const parseMstr = (lRules: any, origin: StrId) => {
  const parserResult = {} as any;

  Object.keys(lRules).forEach((item) => {
    const itemRule = lRules[item as any as StrId];
    if (itemRule) {
      if (itemRule["right"] !== "") {
        const hasMstr = identifierKeysMap.find((item) =>
          itemRule["left"].includes(item),
        );
        if (hasMstr) {
          const newLeft = itemRule["left"].replaceAll(
            hasMstr,
            parserResult[hasMstr],
          );
          const result = origin.slice(newLeft["length"]);
          const rightOf = result.indexOf(itemRule["right"]);
          parserResult[item] = result.slice(0, rightOf);
        } else {
          const newStrId = origin.slice(0, origin.indexOf(itemRule["right"]));
          const result = newStrId.slice(itemRule["left"]["length"]);
          parserResult[item] = result;
        }
      } else {
        const hasMstr = identifierKeysMap.find((item) =>
          itemRule["left"].includes(item),
        );

        if (hasMstr) {
          const newLeft = itemRule["left"].replaceAll(
            hasMstr,
            parserResult[hasMstr],
          );
          const result = origin.slice(newLeft["length"]);
          parserResult[item] = result;
        } else {
          const result = origin.slice(itemRule["left"]["length"]);
          parserResult[item] = result;
        }
      }
    }
  });

  return parserResult;
};

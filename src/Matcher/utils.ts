import { Matcher, matcherKeysMap, MStr, mstrLens, type ScopeType } from "./";

export const checkCastMode = (scope: Matcher<any>): keyof ScopeType => {
  if (Array.isArray(scope.input) && Array.isArray(scope.output)) {
    return "RAry";
  } else {
    return "MStr";
  }
};

export const parseMStrMap = (input: MStr, origin: MStr) => {
  const mstrList = [] as MStr[];
  matcherKeysMap.forEach((item) => {
    if (input.includes(item)) {
      mstrList.push(item);
    }
  });

  return mstrList;
};

export const linkRules = (mstrList: MStr[], input: MStr) => {
  const linkRules = {} as Record<MStr, { left: string; right: string }>;

  mstrList.forEach((item, idx) => {
    const result = { left: "", right: "" };

    const of = input.indexOf(item);

    if (of !== 0) {
      result.left = input.slice(0, of);
    }

    const next = mstrList[idx + 1];
    if (next) {
      const nextOf = input.indexOf(next);
      const del = input.slice(of + mstrLens, nextOf);

      result.right = del;
    } else {
      result.right = input.slice(of + mstrLens);
    }

    linkRules[item] = result;
  });

  return linkRules;
};

export const parseMstr = (lRules: any, origin: MStr) => {
  const parserResult = {} as any;

  Object.keys(lRules).forEach((item) => {
    const itemRule = lRules[item as any as MStr];
    if (itemRule) {
      console.log({ itemRule });
      if (itemRule["right"] !== "") {
        const hasMstr = matcherKeysMap.find((item) =>
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
          const newMStr = origin.slice(0, origin.indexOf(itemRule["right"]));
          const result = newMStr.slice(itemRule["left"]["length"]);
          parserResult[item] = result;
        }
      } else {
        const hasMstr = matcherKeysMap.find((item) =>
          itemRule["left"].includes(item),
        );
        if (hasMstr) {
          const newLeft = itemRule["left"].replaceAll(
            hasMstr,
            parserResult[hasMstr],
          );
          const result = origin.slice(newLeft["length"]);
          parserResult[item] = result;
        }
      }
    }
  });

  return parserResult;
};
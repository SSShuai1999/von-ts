import type { Any } from "ts-toolbelt";
import type { CheckScopeType } from "./checker";
import type { MScope, MScopeConfig } from "./scope";
import type { DepStrIdMap, StrId, StrIdMap, ModeType } from "./mode";
import type { ParseStrId, ParseRoMap } from "./parser";
import type { QueryConstrType } from "./query";

import { MODE_TYPE } from "./mode";
import { checkCastMode, linkRules, parseMstr, parseStrIdMap } from "./utils";

type RDF<Ru, Re> = {
  rules: Ru;
  Return: Re;
};

type MR<Scope extends MScope<any, any, any>, Origin> = Any.Is<
  CheckScopeType<Scope>,
  ModeType["RoMap"],
  "equals"
> extends 1
  ? ParseRoMap<Scope, Origin>
  : Any.Is<CheckScopeType<Scope>, ModeType["StrId"], "equals"> extends 1
  ? ParseStrId<Scope, Origin>
  : never;

export function define<
  I extends StrIdMap,
  O extends DepStrIdMap<StrIdMap>,
  C extends MScopeConfig,
>(input: I, output: O, config?: C) {
  return new Matcher().init(input, output, config);
}

export class Matcher<Scope extends MScope<any, any, any>> {
  public input: Scope["Input"] = undefined;
  public output: Scope["Output"] = undefined;
  public config?: Scope["Config"];

  // constructor can't be filled with self type, so use `init` function,
  init<I, O, C>(
    input: I,
    output: O,
    config?: C,
  ): Matcher<{ Input: I; Output: O; Config: C }> {
    this.input = input;
    this.output = output;
    this.config = config;

    return this as any;
  }

  cast<Origin extends QueryConstrType<Scope>>(
    origin: Origin,
  ): MR<Scope, Origin> {
    const mode = checkCastMode(this);

    if (mode === MODE_TYPE["StrId"]) {
      return this.#castStrId(origin as StrId) as MR<Scope, Origin>;
    }

    if (mode === MODE_TYPE["RoMap"]) {
      return this.#castRoMap(origin) as MR<Scope, Origin>;
    }

    return { error: new Error("Parse Error") } as MR<Scope, Origin>;
  }

  #castStrId(origin: StrId) {
    const mstrList = parseStrIdMap(this.input);
    const lRules = linkRules(mstrList, this.input);
    const parserResult = parseMstr(lRules, origin);

    let result = this.output;
    mstrList.forEach((listItem) => {
      const uppercase = `++${listItem}`;
      const capitalize = `+${listItem}`;
      const lowercase = `--${listItem}`;
      const uncapitalize = `-${listItem}`;

      if (this.config?.convert.includes(uppercase)) {
        result = result.replaceAll(
          listItem,
          parserResult[listItem].toUpperCase(),
        );
      } else if (this.config?.convert.includes(capitalize)) {
        const head = parserResult[listItem].slice(0, 1);
        const tail = parserResult[listItem].slice(1);
        result = result.replaceAll(listItem, head.toUpperCase() + tail);
      } else if (this.config?.convert.includes(lowercase)) {
        result = result.replaceAll(
          listItem,
          parserResult[listItem].toLowerCase(),
        );
      } else if (this.config?.convert.includes(uncapitalize)) {
        const head = parserResult[listItem].slice(0, 1);
        const tail = parserResult[listItem].slice(1);
        result = result.replaceAll(listItem, head.toLowerCase() + tail);
      } else {
        result = result.replaceAll(listItem, parserResult[listItem]);
      }
    });

    return result;
  }

  #castRoMap<T>(origin: T): Scope["Output"][number] {
    const foundIndex = this.input.findIndex((item: any) => item === origin);

    if (foundIndex === -1) {
      return undefined;
    } else {
      return this.output.at(foundIndex);
    }
  }
}

export const von = {
  define,
};

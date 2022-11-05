import { Any } from "ts-toolbelt";
import { CheckScopeType } from "./check";
import { MScope } from "./scope";
import { DepMStrMap, MStr, MStrMap, ModeType } from "./mode";
import { ParseMStr, ParseRAry } from "./parser";
import { QueryConstrType } from "./query";
import { checkCastMode, linkRules, parseMstr, parseMStrMap } from "./utils";

type MR<Scope extends MScope<any, any, any>, Origin> = Any.Is<
  CheckScopeType<Scope>,
  ModeType["RAry"],
  "equals"
> extends 1
  ? ParseRAry<Scope, Origin>
  : Any.Is<CheckScopeType<Scope>, ModeType["MStr"], "equals"> extends 1
  ? ParseMStr<Scope, Origin>
  : never;

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

    if (mode === "MStr") {
      return this.#castMStr(origin as MStr) as MR<Scope, Origin>;
    }

    if (mode === "RAry") {
      return this.#castRAry(origin) as MR<Scope, Origin>;
    }

    return { error: new Error("Parse Error") } as MR<Scope, Origin>;
  }

  #castMStr(origin: MStr) {
    const mstrList = parseMStrMap(this.input);
    const lRules = linkRules(mstrList, this.input);
    const parserResult = parseMstr(lRules, origin);

    let result = this.output;
    mstrList.forEach((item) => {
      if (this.config?.uppercase?.includes(item)) {
        result = result.replaceAll(item, parserResult[item].toUpperCase());
      } else if (this.config?.capitalize?.includes(item)) {
        const head = parserResult[item].slice(0, 1);
        const tail = parserResult[item].slice(1);
        result = result.replaceAll(item, head.toUpperCase() + tail);
      } else if (this.config?.lowercase?.includes(item)) {
        result = result.replaceAll(item, parserResult[item].toLowerCase());
      } else if (this.config?.uncapitalize?.includes(item)) {
        const head = parserResult[item].slice(0, 1);
        const tail = parserResult[item].slice(1);
        result = result.replaceAll(item, head.toLowerCase() + tail);
      } else {
        result = result.replaceAll(item, parserResult[item]);
      }
    });

    return result;
  }

  #castRAry<T>(origin: T): Scope["Output"][number] {
    const foundIndex = this.input.findIndex((item: any) => item === origin);

    if (foundIndex === -1) {
      return undefined;
    } else {
      return this.output.at(foundIndex);
    }
  }
}

export function match<I extends MStrMap, O extends DepMStrMap<MStrMap>, C>(
  input: I,
  output: O,
  config?: C,
) {
  return new Matcher().init(input, output, config);
}

export const von = {
  match,
};

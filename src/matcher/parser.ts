import type { List as L, Object as O, String as S } from "ts-toolbelt";
import type { IdentifierKeysMap } from "./identifier";
import type { LinkRules } from "./linkRules";
import type { StrId } from "./mode";
import type { MScope } from "./scope";
import type { HelperArray } from "../typings";

export type ParseRoMap<
  Scope extends MScope<any, any, any>,
  Origin,
> = HelperArray.At<
  Scope["Output"],
  HelperArray.FindIndex<Scope["Input"], Origin>
>;

type _ParseOriginByStrIdMap<
  PMSM extends ParseStrIdMap<any, any>,
  LinkR extends LinkRules<any, any>,
  Origin extends string,
  Catch extends Record<string, any> = {},
> = PMSM extends []
  ? Catch
  : HelperArray.At<PMSM, 0> extends infer R1 extends string
  ? R1 extends keyof LinkR
    ? LinkR[R1] extends {
        left: infer Left extends string;
        right: infer Right extends string;
      }
      ? Origin extends `${Left}${infer A}${Right}${infer Other}`
        ? Right extends ""
          ? O.Merge<Catch, Record<R1, `${A}${Other}`>>
          : _ParseOriginByStrIdMap<
              L.Remove<PMSM, 0, 0>,
              LinkR,
              Other,
              O.Merge<Catch, Record<R1, A>>
            >
        : never
      : Catch
    : O.Merge<Catch, Record<R1, Origin>>
  : Catch;

type ParseConvertType<
  ConvertMap extends readonly any[],
  SI extends StrId,
> = ConvertMap extends []
  ? SI
  : ConvertMap extends readonly [infer R1, ...infer R2]
  ? R1 extends `++${SI}`
    ? "++"
    : R1 extends `--${SI}`
    ? "--"
    : R1 extends `+${SI}`
    ? "+"
    : R1 extends `-${SI}`
    ? "-"
    : ParseConvertType<R2, SI>
  : SI;

type ConvertValueByType<
  Type extends string,
  Value extends string,
> = Type extends "++"
  ? Uppercase<Value>
  : Type extends "--"
  ? Lowercase<Value>
  : Type extends "+"
  ? Capitalize<Value>
  : Type extends "-"
  ? Uncapitalize<Value>
  : Value;

type HasConvertMap<Config extends MScope<any, any, any>["Config"]> =
  Config extends {
    readonly convert: infer ConvertMap extends readonly any[];
  }
    ? ConvertMap
    : never;

type ReplaceOutput<
  PO extends Record<string, string>,
  PMSM extends ParseStrIdMap<any, any>,
  Output,
  Config extends MScope<any, any, any>["Config"],
> = PMSM extends [infer Key extends keyof PO, ...any]
  ? PO[Key] extends infer Value extends string
    ? // define Config['convert'] variable
      HasConvertMap<Config> extends infer ConvertMap extends readonly any[]
      ? [ConvertMap] extends [never]
        ? ReplaceOutput<
            PO,
            L.Remove<PMSM, 0, 0>,
            S.Replace<Output & string, Key & string, Value>,
            Config
          >
        : ReplaceOutput<
            PO,
            L.Remove<PMSM, 0, 0>,
            S.Replace<
              Output & string,
              Key & string,
              ConvertValueByType<
                ParseConvertType<ConvertMap, Key & StrId>,
                Value
              >
            >,
            Config
          >
      : never // check if `ConvertMap` is `never`
    : never // infer variable
  : Output;

export type ParseOriginByStrIdMap<
  Scope extends MScope<any, any, any>,
  PMSM extends ParseStrIdMap<any, any>,
  Origin extends string,
  LR extends LinkRules<any, any> = LinkRules<PMSM, Scope["Input"]>,
> = _ParseOriginByStrIdMap<PMSM, LR, Origin>;

/**
 * Parse all `StrId` from a string.
 *
 * @example
 *
 * ```
 * type T1 = ParseStrIdMap<'$A$B'>  // ["$A", "$B"]
 * type T1 = ParseStrIdMap<'($A)($B)($C)'> // ["$A", "$B", "$C"]
 * ```
 */
export type ParseStrIdMap<
  T extends string,
  CT extends string[] = [],
> = T extends ""
  ? L.Intersect<CT, IdentifierKeysMap, "<-extends">
  : T extends `$${infer R1}${infer R2}`
  ? ParseStrIdMap<R2, [...CT, `$${R1}`]>
  : T extends `${infer R1}$${infer R2}${infer R3}`
  ? ParseStrIdMap<`${R1}${R3}`, [...CT, `$${R2}`]>
  : T extends `${infer R1}$${infer R2}`
  ? ParseStrIdMap<R1, [...CT, `$${R2}`]>
  : L.Intersect<CT, IdentifierKeysMap, "<-extends">;

export type ParseStrId<
  Scope extends MScope<any, any, any>,
  Origin,
  PMSM extends ParseStrIdMap<any, any> = ParseStrIdMap<Scope["Input"]>,
> = ReplaceOutput<
  ParseOriginByStrIdMap<Scope, PMSM, Origin & string>,
  PMSM,
  Scope["Output"],
  Scope["Config"]
>;

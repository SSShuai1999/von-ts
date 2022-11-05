import { List, O, String as S } from "ts-toolbelt";
import { ArrayType } from "../typings";
import { IdentifierKeysMap } from "./identifier";
import { LinkRules } from "./link";
import { MStr } from "./mode";
import { MScope } from "./scope";

type ReplaceOutput<
  PO extends Record<string, string>,
  PMSM extends ParseMStrMap<any, any>,
  Output,
  Config extends MScope<any, any, any>["Config"],
> = PMSM extends [infer R1 extends string, ...infer R2 extends string[]]
  ? R1 extends keyof PO
    ? Output extends `${any}${R1}${any}`
      ? Config extends { uppercase: infer Case extends readonly MStr[] }
        ? R1 extends Case[number]
          ? ReplaceOutput<
              PO,
              R2,
              S.Replace<Output, R1, Uppercase<PO[R1]>>,
              Config
            >
          : ReplaceOutput<PO, R2, S.Replace<Output, R1, PO[R1]>, Config>
        : Config extends { capitalize: infer Case extends readonly MStr[] }
        ? R1 extends Case[number]
          ? ReplaceOutput<
              PO,
              R2,
              S.Replace<Output, R1, Capitalize<PO[R1]>>,
              Config
            >
          : ReplaceOutput<PO, R2, S.Replace<Output, R1, PO[R1]>, Config>
        : Config extends { lowercase: infer Case extends readonly MStr[] }
        ? R1 extends Case[number]
          ? ReplaceOutput<
              PO,
              R2,
              S.Replace<Output, R1, Lowercase<PO[R1]>>,
              Config
            >
          : ReplaceOutput<PO, R2, S.Replace<Output, R1, PO[R1]>, Config>
        : Config extends { uncapitalize: infer Case extends readonly MStr[] }
        ? R1 extends Case[number]
          ? ReplaceOutput<
              PO,
              R2,
              S.Replace<Output, R1, Uncapitalize<PO[R1]>>,
              Config
            >
          : ReplaceOutput<PO, R2, S.Replace<Output, R1, PO[R1]>, Config>
        : ReplaceOutput<PO, R2, S.Replace<Output, R1, PO[R1]>, Config>
      : ReplaceOutput<PO, R2, Output, Config>
    : ReplaceOutput<PO, R2, Output, Config>
  : Output;

export type ParseRAry<
  Scope extends MScope<any, any, any>,
  Origin,
> = ArrayType.At<Scope["Output"], ArrayType.FindIndex<Scope["Input"], Origin>>;

type _ParseOriginByMStrMap<
  PMSM extends ParseMStrMap<any, any>,
  LinkR extends LinkRules<any, any>,
  Origin extends string,
  Catch extends Record<string, any> = {},
> = PMSM extends []
  ? Catch
  : ArrayType.At<PMSM, 0> extends infer R1 extends string
  ? R1 extends keyof LinkR
    ? LinkR[R1] extends {
        left: infer Left extends string;
        right: infer Right extends string;
      }
      ? Origin extends `${Left}${infer A}${Right}${infer Other}`
        ? Right extends ""
          ? O.Merge<Catch, Record<R1, `${A}${Other}`>>
          : _ParseOriginByMStrMap<
              List.Remove<PMSM, 0, 0>,
              LinkR,
              Other,
              O.Merge<Catch, Record<R1, A>>
            >
        : never
      : Catch
    : O.Merge<Catch, Record<R1, Origin>>
  : Catch;

export type ParseOriginByMStrMap<
  Scope extends MScope<any, any, any>,
  PMSM extends ParseMStrMap<any, any>,
  Origin extends string,
  LinkR extends LinkRules<any, any> = LinkRules<PMSM, Scope["Input"]>,
> = _ParseOriginByMStrMap<PMSM, LinkR, Origin>;

export type ParseMStr<
  Scope extends MScope<any, any, any>,
  Origin,
  PMSM extends ParseMStrMap<any, any> = ParseMStrMap<Scope["Input"]>,
> = ReplaceOutput<
  ParseOriginByMStrMap<Scope, PMSM, Origin & string>,
  PMSM,
  Scope["Output"],
  Scope["Config"]
>;

export type ParseMStrMap<
  T extends string,
  CT extends string[] = [],
> = T extends ""
  ? List.Intersect<CT, IdentifierKeysMap, "<-extends">
  : T extends `$${infer R1}${infer R2}`
  ? ParseMStrMap<R2, [...CT, `$${R1}`]>
  : T extends `${infer R1}$${infer R2}${infer R3}`
  ? ParseMStrMap<`${R1}${R3}`, [...CT, `$${R2}`]>
  : T extends `${infer R1}$${infer R2}`
  ? ParseMStrMap<R1, [...CT, `$${R2}`]>
  : List.Intersect<CT, IdentifierKeysMap, "<-extends">;

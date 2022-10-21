import { PrimitivesKeys, GetPrimitivesByKey, Sub, Head, Tail } from "../helper";
import { ArrayType } from "../typings";
import { Object, String } from "ts-toolbelt";

export type ConverterScope<A, B> = {
  input?: A;
  output?: B;
  type: PrimitivesKeys;
};

export type PatternIOType = Readonly<any[]> | string;

export type NarrowInputOutput<Scope extends ConverterScope<unknown, unknown>> =
  {
    input: Readonly<GetPrimitivesByKey<Scope["type"]>[]>;
    output: unknown;
  };

export type Pattern<
  Scope extends ConverterScope<unknown, unknown>,
  Input extends PatternIOType,
  Output extends PatternIOType,
> = Object.Merge<Scope, { input: Input; output: Output }>;

export type CastStringList<
  Origin,
  Scope extends ConverterScope<unknown, unknown>,
> = Scope["input"] extends Readonly<any[]>
  ? Scope["output"] extends Readonly<any[]>
    ? Origin extends Scope["input"][number]
      ? ArrayType.At<
          Scope["output"],
          ArrayType.FindIndex<Scope["input"], Origin>
        >
      : string
    : string
  : string;

export type CastStringString<
  Origin extends string,
  Scope extends ConverterScope<unknown, unknown>,
> = Scope["input"] extends string
  ? Scope["output"] extends string
    ? RepleaceByParseRusult<
        ParseByOrigin<
          ParseInfinitySymbol<Scope["input"]>,
          Scope["input"],
          Origin
        >,
        Scope["output"]
      >
    : string
  : string;

export type InfinitySymbol = "$";
export type InfinitySymbol2 = String.At<InfinitySymbol, 0>;

type RepleaceByParseRusult<
  Result extends Record<string, any>,
  O extends string,
> = O extends `@UU$${infer R1}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@UU$${String.At<R1, 0>}`,
        Uppercase<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `${infer _}@UU$${infer R1}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@UU$${String.At<R1, 0>}`,
        Uppercase<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `${infer _}@UU$${infer R1}${infer _}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@UU$${String.At<R1, 0>}`,
        Uppercase<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `@U$${infer R1}${infer _}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@U$${String.At<R1, 0>}`,
        Capitalize<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `${infer _}@U$${infer R1}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@U$${String.At<R1, 0>}`,
        Capitalize<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `${infer _}@U$${infer R1}${infer _}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@U$${String.At<R1, 0>}`,
        Capitalize<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `@LL$${infer R1}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@LL$${String.At<R1, 0>}`,
        Lowercase<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `${infer _}@LL$${infer R1}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@LL$${String.At<R1, 0>}`,
        Lowercase<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `${infer _}@LL$${infer R1}${infer _}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@LL$${String.At<R1, 0>}`,
        Lowercase<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `@L$${infer R1}${infer _}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@L$${String.At<R1, 0>}`,
        Uncapitalize<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `${infer _}@L$${infer R1}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@L$${String.At<R1, 0>}`,
        Uncapitalize<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `${infer _}@L$${infer R1}${infer _}`
  ? RepleaceByParseRusult<
      Result,
      String.Replace<
        O,
        `@L$${String.At<R1, 0>}`,
        Uncapitalize<Result[`$${String.At<R1, 0>}`]>
      >
    >
  : O extends `$${infer R1}${infer _}`
  ? RepleaceByParseRusult<Result, String.Replace<O, `$${R1}`, Result[`$${R1}`]>>
  : O extends `${infer _}$${infer R2}`
  ? RepleaceByParseRusult<Result, String.Replace<O, `$${R2}`, Result[`$${R2}`]>>
  : O extends `${infer _}$${infer R2}${infer _}`
  ? RepleaceByParseRusult<Result, String.Replace<O, `$${R2}`, Result[`$${R2}`]>>
  : O;

export type StringLastChar<T extends string> = Sub<
  String.Length<T>,
  1
> extends number
  ? String.At<T, Sub<String.Length<T>, 1>>
  : never;

export type ParseInfinitySymbol<
  T extends string,
  Res extends string[] = [],
> = T extends `$${infer R1}${infer R2}`
  ? ParseInfinitySymbol<R2, [...Res, `$${R1}`]>
  : T extends `${infer R1}$${infer R2}${infer R3}`
  ? ParseInfinitySymbol<`${R1}${R3}`, [...Res, `$${R2}`]>
  : Res;

type GetPrevCharBySymStr<
  Origin extends string,
  Sym extends string,
> = StringLastChar<String.Split<Origin, Sym>[0]>;

type GetTCharD<
  ISS extends string,
  Output extends string,
> = Output extends `${infer R}${ISS}`
  ? R
  : Output extends `${ISS}${infer R}`
  ? R
  : "";

export type ParseByOrigin<
  IS extends string[],
  Input extends string,
  Origin extends string,
  Catch extends Record<string, any> = {},
> = IS extends [infer R extends string]
  ? GetTCharD<R, Input> extends ""
    ? Object.Merge<Catch, Record<Input, Origin>>
    : Object.Merge<
        Catch,
        Record<R, String.Split<Origin, GetTCharD<R, Input> & string>[1]>
      >
  : IS extends [...infer R1 extends string[], infer R2 extends string]
  ? // infer current common Del
    GetPrevCharBySymStr<Input & string, R2> extends infer CommonDel
    ? // infer current origin Del
      Tail<String.Split<Origin, CommonDel & string>> &
        string extends infer CurOriginDel
      ? ParseByOrigin<
          R1,
          Head<String.Split<Input & string, `${CommonDel & string}${R2}`>> &
            string,
          Head<
            String.Split<
              Origin & string,
              `${CommonDel & string}${CurOriginDel & string}`
            >
          > &
            string,
          Object.Merge<Catch, Record<R2, CurOriginDel>>
        >
      : Catch
    : Catch
  : Catch;

type StringAndListParams<Scope extends ConverterScope<unknown, unknown>> =
  Scope["type"] extends "string"
    ? Scope["input"] extends Readonly<any[]>
      ? Scope["output"] extends Readonly<any[]>
        ? true
        : false
      : false
    : false;

type StringAndStringParams<Scope extends ConverterScope<unknown, unknown>> =
  Scope["type"] extends "string"
    ? Scope["input"] extends string
      ? Scope["output"] extends string
        ? true
        : false
      : false
    : false;

export type CastRetType<
  Origin,
  Scope extends ConverterScope<unknown, unknown>,
> = true extends StringAndListParams<Scope>
  ? CastStringList<Origin, Scope>
  : true extends StringAndStringParams<Scope>
  ? CastStringString<Origin & string, Scope>
  : never;

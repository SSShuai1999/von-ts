export type IFloat = `${number}.${number}`;

export type ISize = `${number}` | Number;

type _ToFixedSize<
  T extends number,
  S extends string = "",
  Spec extends number | string = number,
> = Sub<T, 1> extends infer R extends number
  ? _ToFixedSize<R, `${S}${Spec}`>
  : `${number}.${S}`;

export type IntToFixedSize<
  T extends number,
  S extends string = "",
> = _ToFixedSize<T, S, "0">;

export type FloatToFixedSize<
  T extends number,
  S extends string = "",
> = _ToFixedSize<T, S>;

export interface Num {
  From: IFloat | ISize;
  To: number;
}

export type NArray<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _NArray<T, N, []>
  : never;

type _NArray<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _NArray<T, N, [T, ...R]>;

export type NArrayNumber<L extends number> = NArray<number, L>;

export type Add<M extends number, N extends number> = [
  ...NArrayNumber<M>,
  ...NArrayNumber<N>,
]["length"];

export type Sub<M extends number, N extends number> = NArrayNumber<M> extends [
  ...x: NArrayNumber<N>,
  ...rest: infer R,
]
  ? R["length"]
  : unknown;

type _Sub<M extends number, N extends number> = NArrayNumber<M> extends [
  ...x: NArrayNumber<N>,
  ...rest: infer R,
]
  ? R["length"]
  : -1;

type _Mul<
  M extends number,
  N extends number,
  res extends unknown[],
> = N extends 0
  ? res["length"]
  : _Mul<M, _Sub<N, 1>, [...NArray<number, M>, ...res]>;

export type Mul<M extends number, N extends number> = _Mul<M, N, []>;

type _DivBy<
  M extends number,
  N extends number,
  res extends unknown[],
> = M extends 0
  ? res["length"]
  : _Sub<M, N> extends -1
  ? unknown
  : _DivBy<_Sub<M, N>, N, [unknown, ...res]>;

export type DivdBy<M extends number, N extends number> = N extends 0
  ? unknown
  : _DivBy<M, N, []>;

export type Merge<A, B> = {
  [P in keyof A | keyof B]: P extends keyof B
    ? B[P]
    : P extends keyof A
    ? A[P]
    : never;
};

export type Primitives = number | string | boolean;

export type StrPrimitivesMap = {
  number: number;
  string: string;
  boolean: boolean;
};

export type PrimitivesKeys = keyof StrPrimitivesMap;

export type FalsyValue = undefined | null;

export type StrToPrimitives<T extends PrimitivesKeys> = StrPrimitivesMap[T];

export type Special = "literal";

export type DefProps = PrimitivesKeys | Special;

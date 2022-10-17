export type FindIndex<
  Arr extends Readonly<any[]>,
  Target extends any,
  Catch extends number[] = [],
> = Arr extends Readonly<[infer R1, ...infer R2]>
  ? R1 extends Target
    ? Catch["length"]
    : FindIndex<R2, Target, [...Catch, number]>
  : -1;

export type At<Arr extends readonly any[], Index extends number> = Arr[Index];



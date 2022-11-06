(WIP)

# Installation

```shell
npm install von-ts
```

# Concepts

`RDF (Rule Definition Function)`

Refers to a function that can pass in a specific rule, to be more intuitive, here we call `RDF`.

`StrId (String Identifier)`

Pattern defineing for strings (Currently only supports '$A'..'$Z').

`RdAry (Readonly Array)`

For mapping.

# Example

Use `Array` to define

```ts
const input = ["true", 1, "0", "F"] as const;
const output = [true, true, false, false] as const;

const m = von.define(input, output);
```

```ts
const r1 = m.cast("true");
//    ^^ : true

const r2 = m.cast(1);
//    ^^ : true

const r3 = m.cast("0");
//    ^^ : false

const r4 = m.cast("F");
//    ^^ : false
```

Use `string` to define

```ts
const m = von.define(`on-$A`, `on$A`);
const r5 = m.cast("on-click");
//    ^^ : "onclick"
```

Use the 3rd optional parameter `Config`

Use `++` plus `String Identifier`, covert to `uppercase`

```ts
const m1 = von.define(`$A-$B`, `$A$B`, {
  convert: ["++$B"],
} as const);

const r1 = m1.cast("on-click");
//    ^^ const r1: "onCLICK"
```

Use `+` plus `String Identifier`, covert to `capitalize`

```ts
const m2 = von.define(`$A-$B`, `$A$B`, {
  convert: ["+$A", "+$B"],
} as const);

const r2 = m2.cast("on-click");
//    ^^ const r2: "OnClick"
```

Use `--` plus `String Identifier`, covert to `lowercase`

```ts
const m3 = von.define(`$A-$B`, `$A$B`, {
  convert: ["--$A", "--$B"],
} as const);

const r3 = m3.cast("ON-CLICK");
//    ^^ const r3: "onclick"
```

Use `-` plus `String Identifier`, covert to `uncapitalize`

```ts
const m4 = von.define(`$A-$B`, `$A$B`, {
  convert: ["-$B"],
} as const);

const r4 = m4.cast("ON-CLICK");
//    ^^ const r4: "ONcLICK"
```

# More e.g.

```ts
const m1 = von.define(`$A-$B`, `$A$B`, {
  convert: ["+$B", "+$A"],
} as const);

const r1 = m1.cast("on-click");
//    ^^ Type: OnClick
const v1: "OnClick" = r1;
console.log(v1);
/** ----------------------------------------------------------- */

const m2 = von.define(`$A-$B`, `($A)($B)`, {
  convert: ["+$A", "+$B"],
} as const);

const r2 = m2.cast("on-click");
//    ^^ Type: (On)(Click)
const v2: "(On)(Click)" = r2;
console.log(v2);

/** ----------------------------------------------------------- */

const m3 = von.define(`$A-$B`, `$A`, {
  convert: ["+$A"],
} as const);

const r3 = m3.cast("on-click");
//    ^^ Type: On

const v3: "On" = r3;
console.log(v3);

/** ----------------------------------------------------------- */

const m4 = von.define(`$A-$B`, `$B`, {
  convert: ["++$B"],
} as const);

const r4 = m4.cast("on-click");
//    ^^ Type: Click

const v4: "CLICK" = r4;
console.log(v4);
```

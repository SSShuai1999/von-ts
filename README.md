(WIP)

# Installation

```shell
npm install von-ts
```

Example

Use `Array` to match

```ts
const input = ["true", 1, "0", "F"] as const;
const output = [true, true, false, false] as const;

const m = von.match(input, output);
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

Use `string` to match

```ts
const m = von.match(`on-$A`, `on$A`);
const r5 = m.cast("on-click");
//    ^^ : "onclick"
```

Use the 3rd optional parameter `Config`

Covert to `uppercase`

```ts
const m1 = von.match(`$A-$B`, `$A$B`, {
  uppercase: ["$B"],
} as const);

const r1 = m1.cast("on-click");
//    ^^ const r1: "onCLICK"
```

Covert to `capitalize`

```ts
const m2 = von.match(`$A-$B`, `$A$B`, {
  capitalize: ["$A", "$B"],
} as const);

const r2 = m2.cast("on-click");
//    ^^ const r2: "OnClick"
```

Covert to `lowercase`

```ts
const m3 = von.match(`$A-$B`, `$A$B`, {
  lowercase: ["$A", "$B"],
} as const);

const r3 = m3.cast("ON-CLICK");
//    ^^ const r3: "onclick"
```

Covert to `uncapitalize`

```ts
const m4 = von.match(`$A-$B`, `$A$B`, {
  uncapitalize: ["$B"],
} as const);

const r4 = m4.cast("ON-CLICK");
//    ^^ const r4: "ONcLICK"
```

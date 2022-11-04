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

Use `+` to Uppercase

```ts
const m = von.match(`on-$A`, `on+$A`);
const r6 = m.cast("on-click");
//    ^^ : "onClick"
```

Use `-` to Lowercase

```ts
const m1 = von.match(`on-$A`, `on+$A`);
const r7 = m1.cast("on-click");
//    ^^ : "onClick"

const m2 = von.match(`on$A`, `on-$A`);
const r8 = m2.cast(r7);
//    ^^ : "onclick"
```

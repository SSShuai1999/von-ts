import { von } from "./src";

const strPattern = von.string().pattern({
  input: ["true", "false", "1", "0", "haha"],
  output: [true, false, true, false, -1],
} as const);

const r1 = strPattern.cast("true");

const foo1 = true;

import { describe, expect, it } from "vitest";
import { von } from "../src";

// test `cast function`
describe("test cast", () => {
  it("case 1", () => {
    const m1 = von.define(`$A-$B`, `$A$B`, {
      convert: ["+$B", "+$A"],
    } as const);

    const result = m1.cast("on-click");

    console.log({ result });
    expect(result).toEqual("OnClick");
  });

  it("case 2", () => {
    const m1 = von.define(`$A-$B`, `($A)`, {
      convert: ["+$A"],
    } as const);

    const result = m1.cast("on-click");
    expect(result).toEqual("(On)");
  });

  it("case 3", () => {
    const m1 = von.define(`$A-$B`, `($B)`);

    const result = m1.cast("on-click");
    expect(result).toEqual("(click)");
  });

  it("case 4", () => {
    const m1 = von.define(`$A-$B`, `$A-$B`, {
      convert: ["++$B"],
    } as const);

    const result = m1.cast("on-click");
    expect(result).toEqual("on-CLICK");
  });
});

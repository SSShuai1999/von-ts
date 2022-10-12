import { von } from "./src";

const defStr = von.def("string");
const defLiteral = von.def("literal");
const defNumber = von.def("number");
const defBoolean = von.def("boolean");

const foo1 = 1;

const a = defStr.cast(foo1);
const b = defLiteral.cast(foo1);
const c = defNumber.cast(foo1);
const d = defBoolean.cast(foo1);

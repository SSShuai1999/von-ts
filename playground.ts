import { von } from "./src";

const defStr = von.def("string");
const defLiteral = von.def("literal");
const defNumber = von.def("number");
const defBoolean = von.def("boolean");

const foo1 = 1;

const t1 = defStr.cast(foo1);

const t2 = defLiteral.cast(foo1);
const t3 = defNumber.cast(foo1);
const t4 = defBoolean.cast(foo1);

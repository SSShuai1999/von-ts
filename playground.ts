import { von } from "./src";

const defStr = von.def("string");
const defNumber = von.def("number");
const defBoolean = von.def("boolean");

const foo1 = 1;

const a = defStr.cast(foo1);
const b = defNumber.cast(foo1);
const c = defBoolean.cast(foo1);

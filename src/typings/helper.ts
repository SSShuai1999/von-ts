export type ConverBrand = {
  "_++": "_++";
  "_--": "_--";
  "_+": "_+";
  "_-": "_-";
};

export type convertCaseSym = {
  "++": string & ConverBrand["_++"];
  "--": string & ConverBrand["_--"];
  "+": string & ConverBrand["_++"];
  "-": string & ConverBrand["_-"];
};

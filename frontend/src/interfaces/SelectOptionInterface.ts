// Author: Kevin Pabón

/** Option of a <select>: the value it binds and the text it shows. */
export interface SelectOptionInterface<Value extends string | number | boolean = string> {
  value: Value
  label: string
}

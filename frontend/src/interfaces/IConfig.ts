import { Filter } from "./IFilter";

export interface Config {
  _id: string;
  name: string;
  description: string;
  value: string | number | boolean;
  type: "string" | "integer" | "float" | "boolean";
  filters: Filter;
  status: "active" | "deleted" | "superseded";
  updatedAt: string;
}

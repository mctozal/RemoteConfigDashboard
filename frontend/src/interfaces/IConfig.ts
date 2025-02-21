export interface Config {
  _id: string;
  name: string;
  description: string;
  value: string | number | boolean;
  type: "string" | "integer" | "float" | "boolean";
  status: "active" | "deleted" | "superseded";
  updatedAt: string;
  createdAt: string;
}

export interface Config {
  _id: string;
  name: string;
  description: string;
  value: string | number | boolean;
  type: "string" | "integer" | "float" | "boolean";
  status: "active" | "deleted" | "superseded";
  version: string;
  buildNumber: string;
  platform: string;
  country: string;
  updatedAt: string;
  createdAt: string;
}

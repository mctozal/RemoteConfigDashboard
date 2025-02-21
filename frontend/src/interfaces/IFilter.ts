export interface Filter {
  version?: { value: string; operation: string };
  buildNumber?: { value: number; operation: string };
  platform: "All" | "ios" | "Android";
  country?: { operation: "Include" | "Exclude"; values: string[] };
}

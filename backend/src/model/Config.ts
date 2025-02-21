import mongoose, { Schema } from "mongoose";

const FilterSchema = new Schema({
  version: {
    value: String,
    operation: {
      type: String,
      enum: [
        "Equal",
        "NotEqual",
        "GreaterThan",
        "LessThan",
        "GreaterThanOrEqual",
        "LessThanOrEqual",
      ],
    },
  },
  buildNumber: {
    value: Number,
    operation: {
      type: String,
      enum: [
        "Equal",
        "NotEqual",
        "GreaterThan",
        "LessThan",
        "GreaterThanOrEqual",
        "LessThanOrEqual",
      ],
    },
  },
  platform: { type: String, enum: ["All", "ios", "Android"], default: "All" },
  country: {
    operation: { type: String, enum: ["Include", "Exclude"] },
    values: [String],
  },
});

const ConfigSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  value: { type: Schema.Types.Mixed, required: true },
  type: {
    type: String,
    enum: ["string", "integer", "float", "boolean"],
    required: true,
  },
  filters: FilterSchema,
  status: {
    type: String,
    enum: ["active", "deleted", "superseded"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  supersededBy: { type: Schema.Types.ObjectId, ref: "Config" }, // Reference to the new version
});

export default mongoose.model("Config", ConfigSchema);

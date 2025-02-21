import mongoose, { Schema } from "mongoose";

const ConfigSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  value: { type: Schema.Types.Mixed, required: true },
  type: {
    type: String,
    enum: ["string", "integer", "float", "boolean"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "deleted", "superseded"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  supersededBy: { type: Schema.Types.ObjectId, ref: "Config" },
});

export default mongoose.model("Config", ConfigSchema);

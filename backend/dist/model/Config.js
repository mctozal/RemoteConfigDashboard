"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const FilterSchema = new mongoose_1.Schema({
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
const ConfigSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    value: { type: mongoose_1.Schema.Types.Mixed, required: true },
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
    supersededBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Config" }, // Reference to the new version
});
exports.default = mongoose_1.default.model("Config", ConfigSchema);

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const Config_1 = __importDefault(require("./model/Config"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
app.use(express_1.default.json());
// Broadcast to all clients
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify(data));
    });
};
// Check for overlapping configs
const checkOverlap = (newConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, filters } = newConfig;
    const query = { name, status: "active" };
    if (filters.version)
        query["filters.version"] = filters.version;
    if (filters.buildNumber)
        query["filters.buildNumber"] = filters.buildNumber;
    if (filters.platform)
        query["filters.platform"] = filters.platform;
    if (filters.country)
        query["filters.country"] = filters.country;
    const existing = yield Config_1.default.findOne(query);
    return !!existing;
});
// Get all active configs
app.get("/api/configs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy = "name", order = "asc" } = req.query;
    const sortOrder = order === "desc" ? -1 : 1;
    const validSortFields = ["name", "description", "type", "updatedAt"];
    const sortField = validSortFields.includes(sortBy)
        ? sortBy
        : "name";
    const configs = yield Config_1.default.find({ status: "active" }).sort({
        [sortField]: sortOrder,
    });
    res.json(configs);
}));
// Create a config
app.post("/api/configs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (yield checkOverlap(req.body)) {
            return res
                .status(400)
                .json({ error: "Config overlaps with an existing active config" });
        }
        const config = new Config_1.default(Object.assign(Object.assign({}, req.body), { updatedAt: new Date() }));
        yield config.save();
        broadcast({ type: "create", data: config });
        res.status(201).json(config);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Update a config (immutable)
app.put("/api/configs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const original = yield Config_1.default.findById(req.params.id);
        if (!original || original.status !== "active")
            return res.status(404).json({ error: "Config not found" });
        if (yield checkOverlap(Object.assign(Object.assign({}, req.body), { name: original.name }))) {
            return res.status(400).json({
                error: "Updated config overlaps with an existing active config",
            });
        }
        original.status = "superseded";
        original.updatedAt = new Date();
        yield original.save();
        const newConfig = new Config_1.default(Object.assign(Object.assign({}, req.body), { name: original.name, supersededBy: null, updatedAt: new Date() }));
        yield newConfig.save();
        original.supersededBy = newConfig._id;
        yield original.save();
        broadcast({ type: "update", data: newConfig });
        res.json(newConfig);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Delete a config (soft delete)
app.delete("/api/configs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield Config_1.default.findById(req.params.id);
        if (!config || config.status !== "active")
            return res.status(404).json({ error: "Config not found" });
        config.status = "deleted";
        config.updatedAt = new Date();
        yield config.save();
        broadcast({ type: "delete", data: config });
        res.json(config);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// WebSocket connection
wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("close", () => console.log("Client disconnected"));
});
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/remote-config";
mongoose_1.default.connect(MONGO_URI).then(() => console.log("MongoDB connected"));
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

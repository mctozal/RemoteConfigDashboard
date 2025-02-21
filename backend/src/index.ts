import express, { RequestHandler } from "express";
import mongoose from "mongoose";
import { WebSocketServer } from "ws";
import http from "http";
import Config from "./model/Config";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, perMessageDeflate: false });

// Broadcast to all clients
const broadcast = (data: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(data));
  });
};

// // Check for overlapping configs
// const checkOverlap = async (newConfig: any) => {
//   const { name,  } = newConfig;
//   const query: any = { name, status: "active" };

//   if (version) query["version"] = filters.version;
//   if (buildNumber) query["buildNumber"] = filters.buildNumber;
//   if (platform) query["platform"] = filters.platform;
//   if (country) query["country"] = filters.country;

//   const existing = await Config.findOne(query);
//   return !!existing;
// };

// Get all active configs
app.get("/api/configs", cors(corsOptions), async (req, res): Promise<any> => {
  const { sortBy = "name", order = "asc" } = req.query;
  const sortOrder = order === "desc" ? -1 : 1;
  const validSortFields = ["name", "description", "type", "updatedAt"];
  const sortField = validSortFields.includes(sortBy as string)
    ? sortBy
    : "name";

  const configs = await Config.find({ status: "active" }).sort({
    [sortField as string]: sortOrder,
  });
  res.json(configs);
});

// Create a config
app.post("/api/configs", async (req, res): Promise<any> => {
  try {
    // if (await checkOverlap(req.body)) {
    //   return res
    //     .status(400)
    //     .json({ error: "Config overlaps with an existing active config" });
    // }
    const config = new Config({ ...req.body, updatedAt: new Date() });
    await config.save();
    broadcast({ type: "create", data: config });
    res.status(201).json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a config (immutable)
app.put("/api/configs/:id", async (req, res): Promise<any> => {
  try {
    const original = await Config.findById(req.params.id);
    if (!original || original.status !== "active")
      return res.status(404).json({ error: "Config not found" });

    // if (await checkOverlap({ ...req.body, name: original.name })) {
    //   return res.status(400).json({
    //     error: "Updated config overlaps with an existing active config",
    //   });
    // }

    original.status = "superseded";
    original.updatedAt = new Date();
    await original.save();

    const newConfig = new Config({
      ...req.body,
      name: original.name,
      supersededBy: null,
      updatedAt: new Date(),
    });
    await newConfig.save();

    original.supersededBy = newConfig._id;
    await original.save();

    broadcast({ type: "update", data: newConfig });
    res.json(newConfig);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a config (soft delete)
app.delete("/api/configs/:id", async (req, res): Promise<any> => {
  try {
    const config = await Config.findById(req.params.id);
    if (!config || config.status !== "active")
      return res.status(404).json({ error: "Config not found" });

    config.status = "deleted";
    config.updatedAt = new Date();
    await config.save();

    broadcast({ type: "delete", data: config });
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket connection
wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("close", () => console.log("Client disconnected"));
});

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/remote-config";
mongoose.connect(MONGO_URI).then(() => console.log("MongoDB connected"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

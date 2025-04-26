import express from "express";
import path from "path";
import { parseTraceFile } from "./parser";

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/api/tasks", (req, res) => {
  const tracePath = path.join("/data", "trace.txt");  // <-- Use mounted folder
  const tasks = parseTraceFile(tracePath);
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

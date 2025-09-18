import express from "express";
import cors from "cors";
import { documentsRouter as documentRoutes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Application is running");
});

app.use("/documents", documentRoutes);

export default app;
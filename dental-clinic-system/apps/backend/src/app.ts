import "dotenv/config";
import cors from "cors";
import express from "express";
import { patientsRouter } from "./modules/patients/patients.router";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/patients", patientsRouter);

// TODO المرحلة 1 وما بعدها: appointments, chairs, treatments,
// tooth-records, billing, whatsapp, auth

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});

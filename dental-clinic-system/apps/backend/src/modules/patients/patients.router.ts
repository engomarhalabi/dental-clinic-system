import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../prisma-client";
import { requireRole } from "../../middleware/require-role";

export const patientsRouter = Router();

const createPatientSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  medicalHistoryNote: z.string().optional(),
  preferredLanguage: z.enum(["AR", "EN"]).default("AR"),
});

// GET /api/patients?search=
patientsRouter.get(
  "/",
  requireRole("ADMIN", "RECEPTIONIST", "DENTIST", "ACCOUNTANT"),
  async (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const patients = await prisma.patient.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    res.json(patients);
  }
);

// POST /api/patients
patientsRouter.post(
  "/",
  requireRole("ADMIN", "RECEPTIONIST"),
  async (req, res) => {
    const parsed = createPatientSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ errorKey: "validation.failed", details: parsed.error.flatten() });
    }

    const patient = await prisma.patient.create({
      data: {
        ...parsed.data,
        dateOfBirth: parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : undefined,
      },
    });

    res.status(201).json(patient);
  }
);

// GET /api/patients/:id
patientsRouter.get(
  "/:id",
  requireRole("ADMIN", "RECEPTIONIST", "DENTIST", "ACCOUNTANT"),
  async (req, res) => {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
    });

    if (!patient) {
      return res.status(404).json({ errorKey: "patient.notFound" });
    }

    res.json(patient);
  }
);

// GET /api/patients/:id/tooth-history
patientsRouter.get(
  "/:id/tooth-history",
  requireRole("ADMIN", "DENTIST"),
  async (req, res) => {
    const history = await prisma.toothProcedure.findMany({
      where: { patientId: req.params.id },
      orderBy: { performedAt: "desc" },
    });

    res.json(history);
  }
);

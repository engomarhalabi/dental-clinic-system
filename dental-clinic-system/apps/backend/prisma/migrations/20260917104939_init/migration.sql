/*
  Warnings:

  - The values [PARTIAL] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `treatmentPlanId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `locationNote` on the `chairs` table. All the data in the column will be lost.
  - You are about to drop the column `issuedAt` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `treatmentPlanId` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `medicalHistoryNote` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `preferredLanguage` on the `patients` table. All the data in the column will be lost.
  - The `gender` column on the `patients` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `chair_shifts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dentist_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tooth_procedures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `treatment_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `treatment_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `whatsapp_logs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[visitId]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fileNumber]` on the table `patients` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `treatmentType` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `invoices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'CONFIRMED';

-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');
ALTER TABLE "invoices" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "invoices" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "InvoiceStatus_old";
ALTER TABLE "invoices" ALTER COLUMN "status" SET DEFAULT 'UNPAID';
COMMIT;

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_chairId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_treatmentPlanId_fkey";

-- DropForeignKey
ALTER TABLE "chair_shifts" DROP CONSTRAINT "chair_shifts_chairId_fkey";

-- DropForeignKey
ALTER TABLE "chair_shifts" DROP CONSTRAINT "chair_shifts_dentistId_fkey";

-- DropForeignKey
ALTER TABLE "dentist_profiles" DROP CONSTRAINT "dentist_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_patientId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_treatmentPlanId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_receivedById_fkey";

-- DropForeignKey
ALTER TABLE "tooth_procedures" DROP CONSTRAINT "tooth_procedures_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "tooth_procedures" DROP CONSTRAINT "tooth_procedures_patientId_fkey";

-- DropForeignKey
ALTER TABLE "tooth_procedures" DROP CONSTRAINT "tooth_procedures_performedById_fkey";

-- DropForeignKey
ALTER TABLE "tooth_procedures" DROP CONSTRAINT "tooth_procedures_treatmentPlanId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_plans" DROP CONSTRAINT "treatment_plans_patientId_fkey";

-- DropForeignKey
ALTER TABLE "treatment_plans" DROP CONSTRAINT "treatment_plans_treatmentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "whatsapp_logs" DROP CONSTRAINT "whatsapp_logs_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "whatsapp_logs" DROP CONSTRAINT "whatsapp_logs_patientId_fkey";

-- DropIndex
DROP INDEX "appointments_chairId_scheduledAt_idx";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "treatmentPlanId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "chairId" DROP NOT NULL,
ALTER COLUMN "dentistId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "chairs" DROP COLUMN "locationNote",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "issuedAt",
DROP COLUMN "treatmentPlanId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "treatmentType" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "visitId" TEXT;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "medicalHistoryNote",
DROP COLUMN "preferredLanguage",
ADD COLUMN     "fileNumber" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "medicalNotes" TEXT,
ADD COLUMN     "whatsapp" TEXT,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;

-- DropTable
DROP TABLE "chair_shifts";

-- DropTable
DROP TABLE "dentist_profiles";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "tooth_procedures";

-- DropTable
DROP TABLE "treatment_plans";

-- DropTable
DROP TABLE "treatment_types";

-- DropTable
DROP TABLE "whatsapp_logs";

-- DropEnum
DROP TYPE "Language";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "TreatmentPlanStatus";

-- DropEnum
DROP TYPE "WhatsAppMessageType";

-- DropEnum
DROP TYPE "WhatsAppStatus";

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "dentistId" TEXT,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diagnosis" TEXT,
    "doctorNotes" TEXT,
    "followUpAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tooth_records" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "toothNumber" TEXT NOT NULL,
    "currentStatus" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tooth_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tooth_history" (
    "id" TEXT NOT NULL,
    "toothRecordId" TEXT NOT NULL,
    "visitId" TEXT,
    "performedById" TEXT,
    "procedure" TEXT NOT NULL,
    "statusAfter" TEXT,
    "notes" TEXT,
    "procedureDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tooth_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visits_appointmentId_key" ON "visits"("appointmentId");

-- CreateIndex
CREATE INDEX "visits_patientId_idx" ON "visits"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "tooth_records_patientId_toothNumber_key" ON "tooth_records"("patientId", "toothNumber");

-- CreateIndex
CREATE INDEX "tooth_history_toothRecordId_idx" ON "tooth_history"("toothRecordId");

-- CreateIndex
CREATE INDEX "appointments_scheduledAt_idx" ON "appointments"("scheduledAt");

-- CreateIndex
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_visitId_key" ON "invoices"("visitId");

-- CreateIndex
CREATE INDEX "invoices_patientId_idx" ON "invoices"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_fileNumber_key" ON "patients"("fileNumber");

-- CreateIndex
CREATE INDEX "patients_phone_idx" ON "patients"("phone");

-- CreateIndex
CREATE INDEX "patients_fullName_idx" ON "patients"("fullName");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_chairId_fkey" FOREIGN KEY ("chairId") REFERENCES "chairs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_dentistId_fkey" FOREIGN KEY ("dentistId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tooth_records" ADD CONSTRAINT "tooth_records_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tooth_history" ADD CONSTRAINT "tooth_history_toothRecordId_fkey" FOREIGN KEY ("toothRecordId") REFERENCES "tooth_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tooth_history" ADD CONSTRAINT "tooth_history_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tooth_history" ADD CONSTRAINT "tooth_history_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

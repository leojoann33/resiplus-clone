import { getDb } from "./_core/db";
import {
  cie10Codes,
  pathologies,
  allergies,
  medicalAntecedents,
  treatments,
  medications,
  pathologyHistory,
  medicalProcedures,
  InsertCIE10Code,
  InsertPathology,
  InsertAllergy,
  InsertMedicalAntecedent,
  InsertTreatment,
  InsertMedication,
  InsertPathologyHistory,
  InsertMedicalProcedure,
} from "../drizzle/schema_medical";
import { eq, and } from "drizzle-orm";

// ============= CIE10 Codes =============

export async function searchCIE10Codes(searchTerm: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(cie10Codes)
    .where(
      searchTerm.length <= 3
        ? eq(cie10Codes.code, searchTerm)
        : undefined
    )
    .limit(50);
}

export async function getCIE10CodesByDescription(description: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(cie10Codes)
    .limit(50);
}

// ============= Pathologies =============

export async function createPathology(data: InsertPathology) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(pathologies).values(data);
  return result;
}

export async function getResidentPathologies(residentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(pathologies)
    .where(eq(pathologies.residentId, residentId));
}

export async function updatePathology(id: number, data: Partial<InsertPathology>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(pathologies)
    .set(data)
    .where(eq(pathologies.id, id));
}

export async function deletePathology(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(pathologies).where(eq(pathologies.id, id));
}

// ============= Allergies =============

export async function createAllergy(data: InsertAllergy) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(allergies).values(data);
}

export async function getResidentAllergies(residentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(allergies)
    .where(eq(allergies.residentId, residentId));
}

export async function updateAllergy(id: number, data: Partial<InsertAllergy>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(allergies)
    .set(data)
    .where(eq(allergies.id, id));
}

export async function deleteAllergy(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(allergies).where(eq(allergies.id, id));
}

// ============= Medical Antecedents =============

export async function createMedicalAntecedent(data: InsertMedicalAntecedent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(medicalAntecedents).values(data);
}

export async function getResidentAntecedents(residentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(medicalAntecedents)
    .where(eq(medicalAntecedents.residentId, residentId));
}

export async function updateMedicalAntecedent(id: number, data: Partial<InsertMedicalAntecedent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(medicalAntecedents)
    .set(data)
    .where(eq(medicalAntecedents.id, id));
}

export async function deleteMedicalAntecedent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(medicalAntecedents).where(eq(medicalAntecedents.id, id));
}

// ============= Treatments =============

export async function createTreatment(data: InsertTreatment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(treatments).values(data);
}

export async function getResidentTreatments(residentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(treatments)
    .where(eq(treatments.residentId, residentId));
}

export async function getTreatmentById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(treatments)
    .where(eq(treatments.id, id))
    .limit(1);
}

export async function updateTreatment(id: number, data: Partial<InsertTreatment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(treatments)
    .set(data)
    .where(eq(treatments.id, id));
}

export async function deleteTreatment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(treatments).where(eq(treatments.id, id));
}

// ============= Medications =============

export async function createMedication(data: InsertMedication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(medications).values(data);
}

export async function getTreatmentMedications(treatmentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(medications)
    .where(eq(medications.treatmentId, treatmentId));
}

export async function updateMedication(id: number, data: Partial<InsertMedication>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(medications)
    .set(data)
    .where(eq(medications.id, id));
}

export async function deleteMedication(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(medications).where(eq(medications.id, id));
}

// ============= Pathology History =============

export async function createPathologyHistory(data: InsertPathologyHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(pathologyHistory).values(data);
}

export async function getPathologyHistory(pathologyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(pathologyHistory)
    .where(eq(pathologyHistory.pathologyId, pathologyId));
}

// ============= Medical Procedures =============

export async function createMedicalProcedure(data: InsertMedicalProcedure) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(medicalProcedures).values(data);
}

export async function getResidentProcedures(residentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(medicalProcedures)
    .where(eq(medicalProcedures.residentId, residentId));
}

export async function updateMedicalProcedure(id: number, data: Partial<InsertMedicalProcedure>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(medicalProcedures)
    .set(data)
    .where(eq(medicalProcedures.id, id));
}

export async function deleteMedicalProcedure(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(medicalProcedures).where(eq(medicalProcedures.id, id));
}

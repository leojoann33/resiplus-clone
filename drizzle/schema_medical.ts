import { mysqlTable, int, varchar, text, datetime, date, time, timestamp, boolean } from "drizzle-orm/mysql-core";

// Tabla: CIE10 Codes (Maestro de códigos de diagnóstico)
export const cie10Codes = mysqlTable("cie10_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).unique().notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabla: Pathologies (Patologías del residente)
export const pathologies = mysqlTable("pathologies", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("resident_id").notNull(),
  cieCode: varchar("cie_code", { length: 10 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  unifiedCode: varchar("unified_code", { length: 50 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

// Tabla: Allergies (Alergias del residente)
export const allergies = mysqlTable("allergies", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("resident_id").notNull(),
  allergyCode: varchar("allergy_code", { length: 10 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  severity: varchar("severity", { length: 50 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

// Tabla: Medical Antecedents (Antecedentes médicos)
export const medicalAntecedents = mysqlTable("medical_antecedents", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("resident_id").notNull(),
  antecedentCode: varchar("antecedent_code", { length: 10 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

// Tabla: Treatments (Tratamientos del residente)
export const treatments = mysqlTable("treatments", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("resident_id").notNull(),
  orderDate: datetime("order_date").notNull(),
  doctorId: varchar("doctor_id", { length: 100 }),
  createdBy: varchar("created_by", { length: 100 }).notNull(),
  observations: text("observations"),
  status: varchar("status", { length: 50 }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

// Tabla: Medications (Medicamentos del tratamiento)
export const medications = mysqlTable("medications", {
  id: int("id").autoincrement().primaryKey(),
  treatmentId: int("treatment_id").notNull(),
  medicationName: varchar("medication_name", { length: 255 }).notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  startTime: time("start_time"),
  endTime: time("end_time"),
  daysOfWeek: varchar("days_of_week", { length: 7 }),
  intervals: varchar("intervals", { length: 50 }),
  administrationRoute: varchar("administration_route", { length: 100 }),
  unit: varchar("unit", { length: 50 }),
  pathology: varchar("pathology", { length: 255 }),
  specialNotes: text("special_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

// Tabla: Pathology History (Historial de evolución de patologías)
export const pathologyHistory = mysqlTable("pathology_history", {
  id: int("id").autoincrement().primaryKey(),
  pathologyId: int("pathology_id").notNull(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date"),
  status: varchar("status", { length: 50 }),
  observations: text("observations"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabla: Medical Procedures (Procedimientos médicos)
export const medicalProcedures = mysqlTable("medical_procedures", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("resident_id").notNull(),
  procedureCode: varchar("procedure_code", { length: 10 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  procedureDate: datetime("procedure_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});

// Types para TypeScript
export type CIE10Code = typeof cie10Codes.$inferSelect;
export type InsertCIE10Code = typeof cie10Codes.$inferInsert;

export type Pathology = typeof pathologies.$inferSelect;
export type InsertPathology = typeof pathologies.$inferInsert;

export type Allergy = typeof allergies.$inferSelect;
export type InsertAllergy = typeof allergies.$inferInsert;

export type MedicalAntecedent = typeof medicalAntecedents.$inferSelect;
export type InsertMedicalAntecedent = typeof medicalAntecedents.$inferInsert;

export type Treatment = typeof treatments.$inferSelect;
export type InsertTreatment = typeof treatments.$inferInsert;

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = typeof medications.$inferInsert;

export type PathologyHistory = typeof pathologyHistory.$inferSelect;
export type InsertPathologyHistory = typeof pathologyHistory.$inferInsert;

export type MedicalProcedure = typeof medicalProcedures.$inferSelect;
export type InsertMedicalProcedure = typeof medicalProcedures.$inferInsert;

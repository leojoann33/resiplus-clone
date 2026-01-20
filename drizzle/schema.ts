import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabla de Residentes - Datos personales y administrativos
 */
export const residents = mysqlTable("residents", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  nif: varchar("nif", { length: 20 }),
  nss: varchar("nss", { length: 20 }),
  nsip: varchar("nsip", { length: 20 }),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  birthDate: date("birthDate"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  admissionDate: date("admissionDate").notNull(),
  lastAdmissionDate: date("lastAdmissionDate"),
  birthPlace: varchar("birthPlace", { length: 200 }),
  roomId: int("roomId"),
  bedNumber: int("bedNumber"),
  status: mysqlEnum("status", ["active", "discharged", "deceased"]).default("active").notNull(),
  contactPhone: varchar("contactPhone", { length: 20 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  emergencyContactName: varchar("emergencyContactName", { length: 200 }),
  emergencyContactPhone: varchar("emergencyContactPhone", { length: 20 }),
  emergencyContactRelation: varchar("emergencyContactRelation", { length: 100 }),
  notes: text("notes"),
  medicalNotes: text("medicalNotes"),
  allergies: text("allergies"),
  specialNeeds: text("specialNeeds"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").notNull(),
});

export type Resident = typeof residents.$inferSelect;
export type InsertResident = typeof residents.$inferInsert;

/**
 * Tabla de Habitaciones
 */
export const rooms = mysqlTable("rooms", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  roomType: mysqlEnum("roomType", ["single", "double", "triple", "shared"]).notNull(),
  floor: int("floor"),
  wing: varchar("wing", { length: 50 }),
  totalBeds: int("totalBeds").notNull(),
  availableBeds: int("availableBeds").notNull(),
  hasPrivateBathroom: boolean("hasPrivateBathroom").default(false),
  hasBalcony: boolean("hasBalcony").default(false),
  isAccessible: boolean("isAccessible").default(false),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;

/**
 * Tabla de Constantes Vitales
 */
export const vitalSigns = mysqlTable("vitalSigns", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("residentId").notNull(),
  measurementType: mysqlEnum("measurementType", [
    "blood_pressure",
    "heart_rate",
    "respiratory_rate",
    "oxygen_saturation",
    "temperature",
    "glucose",
    "weight"
  ]).notNull(),
  systolicBP: int("systolicBP"),
  diastolicBP: int("diastolicBP"),
  heartRate: int("heartRate"),
  respiratoryRate: int("respiratoryRate"),
  oxygenSaturation: decimal("oxygenSaturation", { precision: 5, scale: 2 }),
  temperature: decimal("temperature", { precision: 4, scale: 2 }),
  glucose: int("glucose"),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  notes: text("notes"),
  measurementDate: timestamp("measurementDate").notNull(),
  recordedBy: int("recordedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VitalSign = typeof vitalSigns.$inferSelect;
export type InsertVitalSign = typeof vitalSigns.$inferInsert;

/**
 * Tabla de Escalas de Valoración
 */
export const assessmentScales = mysqlTable("assessmentScales", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("residentId").notNull(),
  scaleType: mysqlEnum("scaleType", ["barthel", "norton"]).notNull(),
  totalScore: int("totalScore").notNull(),
  assessmentDate: timestamp("assessmentDate").notNull(),
  assessmentData: text("assessmentData").notNull(), // JSON con detalles de cada ítem
  interpretation: text("interpretation"),
  notes: text("notes"),
  assessedBy: int("assessedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssessmentScale = typeof assessmentScales.$inferSelect;
export type InsertAssessmentScale = typeof assessmentScales.$inferInsert;

/**
 * Tabla de Medicamentos
 */
export const medications = mysqlTable("medications", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("residentId").notNull(),
  medicationName: varchar("medicationName", { length: 200 }).notNull(),
  activeIngredient: varchar("activeIngredient", { length: 200 }),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  administrationRoute: mysqlEnum("administrationRoute", [
    "oral",
    "sublingual",
    "intravenous",
    "intramuscular",
    "subcutaneous",
    "topical",
    "rectal",
    "inhalation",
    "ophthalmic",
    "otic",
    "nasal"
  ]).notNull(),
  frequency: varchar("frequency", { length: 100 }).notNull(),
  scheduleType: mysqlEnum("scheduleType", ["acute", "chronic"]).notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"),
  monday: boolean("monday").default(false),
  tuesday: boolean("tuesday").default(false),
  wednesday: boolean("wednesday").default(false),
  thursday: boolean("thursday").default(false),
  friday: boolean("friday").default(false),
  saturday: boolean("saturday").default(false),
  sunday: boolean("sunday").default(false),
  administrationTimes: text("administrationTimes").notNull(), // JSON array de horarios
  indication: text("indication"),
  prescribedBy: varchar("prescribedBy", { length: 200 }),
  notes: text("notes"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").notNull(),
});

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = typeof medications.$inferInsert;

/**
 * Tabla de Observaciones de Enfermería
 */
export const nursingNotes = mysqlTable("nursingNotes", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("residentId").notNull(),
  category: mysqlEnum("category", [
    "general",
    "vital_signs",
    "medication",
    "nutrition",
    "hygiene",
    "mobility",
    "behavior",
    "wound_care",
    "incident"
  ]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal"),
  noteDate: timestamp("noteDate").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NursingNote = typeof nursingNotes.$inferSelect;
export type InsertNursingNote = typeof nursingNotes.$inferInsert;

// ============ GESTIÓN DE ÚLCERAS (Ulcer Management) ============

export const ulcers = mysqlTable("ulcers", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("residentId").notNull(),
  code: varchar("code", { length: 50 }),
  onsetDate: date("onsetDate").notNull(),
  healDate: date("healDate"),
  location: varchar("location", { length: 200 }).notNull(),
  stage: varchar("stage", { length: 100 }).notNull(), // Tipo/Estadío
  size: varchar("size", { length: 100 }), // cm x cm
  riskFactors: text("riskFactors"), // JSON array of strings
  observations: text("observations"),
  isActive: boolean("isActive").default(true).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ulcer = typeof ulcers.$inferSelect;
export type InsertUlcer = typeof ulcers.$inferInsert;

export const ulcerCures = mysqlTable("ulcerCures", {
  id: int("id").autoincrement().primaryKey(),
  ulcerId: int("ulcerId").notNull(),
  performedAt: timestamp("performedAt").defaultNow().notNull(),
  performedBy: int("performedBy").notNull(),
  treatment: text("treatment"),
  observations: text("observations"),
  nextCure: date("nextCure"),
  status: mysqlEnum("status", ["pending", "completed"]).default("completed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UlcerCure = typeof ulcerCures.$inferSelect;
export type InsertUlcerCure = typeof ulcerCures.$inferInsert;

// ============ PLANES DE CUIDADOS (Care Planning Module) ============

/**
 * Tabla de Tipos de Cuidados - Lista maestra de todos los cuidados
 */
export const careTypes = mysqlTable("careTypes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["control", "actividad", "registro"]).notNull(),
  professionalArea: mysqlEnum("professionalArea", [
    "enfermeria",
    "trabajador_social",
    "psicologo",
    "fisioterapeuta",
    "terapeuta_ocupacional",
    "animador",
    "educador",
    "dietista",
    "logopeda",
    "medico"
  ]).default("enfermeria").notNull(),
  requiresResult: boolean("requiresResult").default(false),
  resultType: mysqlEnum("resultType", ["numeric", "text", "boolean", "scale"]),
  resultUnit: varchar("resultUnit", { length: 50 }),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CareType = typeof careTypes.$inferSelect;
export type InsertCareType = typeof careTypes.$inferInsert;

/**
 * Tabla de Tareas de Cuidados por Residente
 */
export const careTasks = mysqlTable("careTasks", {
  id: int("id").autoincrement().primaryKey(),
  residentId: int("residentId").notNull(),
  careTypeId: int("careTypeId").notNull(),
  subtype: varchar("subtype", { length: 200 }),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"),
  scheduledHour: varchar("scheduledHour", { length: 10 }),
  recurrenceType: mysqlEnum("recurrenceType", [
    "none",
    "daily",
    "weekly",
    "monthly",
    "custom"
  ]).default("none"),
  recurrencePattern: text("recurrencePattern"), // JSON: e.g. {"every":2,"daysOfWeek":[1,3,5]}
  professionalArea: varchar("professionalArea", { length: 100 }),
  assignedUserId: int("assignedUserId"),
  indication: text("indication"),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "paused", "completed", "cancelled"]).default("active").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CareTask = typeof careTasks.$inferSelect;
export type InsertCareTask = typeof careTasks.$inferInsert;

/**
 * Tabla de Grupos de Planificación
 */
export const careGroups = mysqlTable("careGroups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  groupType: mysqlEnum("groupType", ["control", "actividad"]).default("control").notNull(),
  careTypeId: int("careTypeId"),
  code: varchar("code", { length: 50 }),
  codeUnificado: varchar("codeUnificado", { length: 100 }),
  professionalArea: varchar("professionalArea", { length: 100 }),
  scheduledHour: varchar("scheduledHour", { length: 10 }),
  recurrencePattern: text("recurrencePattern"), // JSON
  assignedUserId: int("assignedUserId"),
  durationHours: decimal("durationHours", { precision: 4, scale: 2 }),
  indication: text("indication"),
  isActive: boolean("isActive").default(true).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CareGroup = typeof careGroups.$inferSelect;
export type InsertCareGroup = typeof careGroups.$inferInsert;

/**
 * Tabla de Residentes en Grupos (asignación fija)
 */
export const careGroupResidents = mysqlTable("careGroupResidents", {
  id: int("id").autoincrement().primaryKey(),
  careGroupId: int("careGroupId").notNull(),
  residentId: int("residentId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  addedBy: int("addedBy").notNull(),
});

export type CareGroupResident = typeof careGroupResidents.$inferSelect;
export type InsertCareGroupResident = typeof careGroupResidents.$inferInsert;

/**
 * Tabla de Tareas Programadas (instancias diarias)
 */
export const scheduledTasks = mysqlTable("scheduledTasks", {
  id: int("id").autoincrement().primaryKey(),
  careTaskId: int("careTaskId"),
  careGroupId: int("careGroupId"),
  residentId: int("residentId").notNull(),
  careTypeId: int("careTypeId").notNull(),
  scheduledDateTime: timestamp("scheduledDateTime").notNull(),
  taskType: mysqlEnum("taskType", ["individual", "group"]).default("individual").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "completed",
    "not_done",
    "absent",
    "cancelled"
  ]).default("pending").notNull(),
  executionDateTime: timestamp("executionDateTime"),
  executedByUserId: int("executedByUserId"),
  resultValue: text("resultValue"), // JSON for complex results
  resultNumeric: decimal("resultNumeric", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ScheduledTask = typeof scheduledTasks.$inferSelect;
export type InsertScheduledTask = typeof scheduledTasks.$inferInsert;

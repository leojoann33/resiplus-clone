import { and, desc, eq, like, or, sql, gte, lte, between } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  residents, 
  InsertResident, 
  rooms, 
  InsertRoom,
  vitalSigns,
  InsertVitalSign,
  assessmentScales,
  InsertAssessmentScale,
  medications,
  InsertMedication,
  nursingNotes,
  InsertNursingNote,
  // Care Planning Module
  careTypes,
  InsertCareType,
  careTasks,
  InsertCareTask,
  careGroups,
  InsertCareGroup,
  careGroupResidents,
  InsertCareGroupResident,
  scheduledTasks,
  InsertScheduledTask,
  // Ulcer Management
  ulcers,
  InsertUlcer,
  ulcerCures,
  InsertUlcerCure
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER HELPERS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ RESIDENT HELPERS ============

export async function createResident(resident: InsertResident) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(residents).values(resident);
  
  // Retrieve the created resident by code (unique field)
  const created = await db.select().from(residents).where(eq(residents.code, resident.code)).limit(1);
  return created[0];
}

export async function getResidentById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(residents).where(eq(residents.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllResidents(filters?: {
  status?: string;
  searchTerm?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  let query = db.select().from(residents);
  
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(residents.status, filters.status as any));
  }
  
  if (filters?.searchTerm) {
    const searchPattern = `%${filters.searchTerm}%`;
    conditions.push(
      or(
        like(residents.firstName, searchPattern),
        like(residents.lastName, searchPattern),
        like(residents.code, searchPattern),
        like(residents.nif, searchPattern)
      )
    );
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const result = await query.orderBy(desc(residents.createdAt));
  return result;
}

export async function updateResident(id: number, data: Partial<InsertResident>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(residents).set(data).where(eq(residents.id, id));
  
  // Retrieve and return the updated resident
  const updated = await db.select().from(residents).where(eq(residents.id, id)).limit(1);
  return updated[0];
}

export async function deleteResident(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(residents).where(eq(residents.id, id));
}

// ============ ROOM HELPERS ============

export async function createRoom(room: InsertRoom) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(rooms).values(room);
  return result;
}

export async function getAllRooms() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(rooms).orderBy(rooms.code);
  return result;
}

export async function getRoomById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateRoom(id: number, data: Partial<InsertRoom>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(rooms).set(data).where(eq(rooms.id, id));
}

export async function deleteRoom(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(rooms).where(eq(rooms.id, id));
}

// ============ VITAL SIGNS HELPERS ============

export async function createVitalSign(vitalSign: InsertVitalSign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(vitalSigns).values(vitalSign);
  return result;
}

export async function getVitalSignsByResidentId(residentId: number, limit?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  let query = db.select().from(vitalSigns).where(eq(vitalSigns.residentId, residentId)).orderBy(desc(vitalSigns.measurementDate));
  
  if (limit) {
    query = query.limit(limit) as any;
  }
  
  return await query;
}

export async function getVitalSignsByType(residentId: number, measurementType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select()
    .from(vitalSigns)
    .where(
      and(
        eq(vitalSigns.residentId, residentId),
        eq(vitalSigns.measurementType, measurementType as any)
      )
    )
    .orderBy(desc(vitalSigns.measurementDate));
  
  return result;
}

// ============ ASSESSMENT SCALE HELPERS ============

export async function createAssessmentScale(assessment: InsertAssessmentScale) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(assessmentScales).values(assessment);
  return result;
}

export async function getAssessmentScalesByResidentId(residentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select()
    .from(assessmentScales)
    .where(eq(assessmentScales.residentId, residentId))
    .orderBy(desc(assessmentScales.assessmentDate));
  
  return result;
}

export async function getAssessmentScalesByType(residentId: number, scaleType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select()
    .from(assessmentScales)
    .where(
      and(
        eq(assessmentScales.residentId, residentId),
        eq(assessmentScales.scaleType, scaleType as any)
      )
    )
    .orderBy(desc(assessmentScales.assessmentDate));
  
  return result;
}

// ============ MEDICATION HELPERS ============

export async function createMedication(medication: InsertMedication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(medications).values(medication);
  return result;
}

export async function getMedicationsByResidentId(residentId: number, activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = [eq(medications.residentId, residentId)];
  
  if (activeOnly) {
    conditions.push(eq(medications.isActive, true));
  }
  
  const result = await db.select()
    .from(medications)
    .where(and(...conditions))
    .orderBy(desc(medications.createdAt));
  
  return result;
}

export async function updateMedication(id: number, data: Partial<InsertMedication>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(medications).set(data).where(eq(medications.id, id));
}

export async function deactivateMedication(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(medications).set({ isActive: false }).where(eq(medications.id, id));
}

export async function deleteMedication(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(medications).where(eq(medications.id, id));
}

// ============ NURSING NOTES HELPERS ============

export async function createNursingNote(note: InsertNursingNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(nursingNotes).values(note);
  return result;
}

export async function getNursingNotesByResidentId(residentId: number, limit?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  let query = db.select().from(nursingNotes).where(eq(nursingNotes.residentId, residentId)).orderBy(desc(nursingNotes.noteDate));
  
  if (limit) {
    query = query.limit(limit) as any;
  }
  
  return await query;
}

export async function updateNursingNote(id: number, data: Partial<InsertNursingNote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(nursingNotes).set(data).where(eq(nursingNotes.id, id));
}

export async function deleteNursingNote(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(nursingNotes).where(eq(nursingNotes.id, id));
}

// ============ CARE TYPES HELPERS ============

export async function getAllCareTypes(activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = activeOnly ? [eq(careTypes.isActive, true)] : [];
  
  const result = await db.select()
    .from(careTypes)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(careTypes.sortOrder, careTypes.name);
  
  return result;
}

export async function getCareTypeById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(careTypes).where(eq(careTypes.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCareType(careType: InsertCareType) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(careTypes).values(careType);
  const created = await db.select().from(careTypes).where(eq(careTypes.code, careType.code)).limit(1);
  return created[0];
}

export async function updateCareType(id: number, data: Partial<InsertCareType>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(careTypes).set(data).where(eq(careTypes.id, id));
}

export async function deleteCareType(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(careTypes).set({ isActive: false }).where(eq(careTypes.id, id));
}

// ============ CARE TASKS HELPERS ============

export async function getCareTasksByResidentId(residentId: number, activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = [eq(careTasks.residentId, residentId)];
  if (activeOnly) {
    conditions.push(eq(careTasks.status, "active"));
  }
  
  const result = await db.select()
    .from(careTasks)
    .where(and(...conditions))
    .orderBy(desc(careTasks.createdAt));
  
  return result;
}

export async function getCareTaskById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(careTasks).where(eq(careTasks.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCareTask(task: InsertCareTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(careTasks).values(task);
  return result;
}

export async function updateCareTask(id: number, data: Partial<InsertCareTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(careTasks).set(data).where(eq(careTasks.id, id));
}

export async function deleteCareTask(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(careTasks).set({ status: "cancelled" }).where(eq(careTasks.id, id));
}

// ============ CARE GROUPS HELPERS ============

export async function getAllCareGroups(activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = activeOnly ? [eq(careGroups.isActive, true)] : [];
  
  const result = await db.select()
    .from(careGroups)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(careGroups.name);
  
  return result;
}

export async function getCareGroupById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(careGroups).where(eq(careGroups.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCareGroup(group: InsertCareGroup) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(careGroups).values(group);
  return result;
}

export async function updateCareGroup(id: number, data: Partial<InsertCareGroup>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(careGroups).set(data).where(eq(careGroups.id, id));
}

export async function deleteCareGroup(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(careGroups).set({ isActive: false }).where(eq(careGroups.id, id));
}

// ============ CARE GROUP RESIDENTS HELPERS ============

export async function getCareGroupResidents(careGroupId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select()
    .from(careGroupResidents)
    .where(eq(careGroupResidents.careGroupId, careGroupId));
  
  return result;
}

export async function addResidentToGroup(data: InsertCareGroupResident) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if already exists
  const existing = await db.select()
    .from(careGroupResidents)
    .where(and(
      eq(careGroupResidents.careGroupId, data.careGroupId),
      eq(careGroupResidents.residentId, data.residentId)
    ))
    .limit(1);
  
  if (existing.length === 0) {
    await db.insert(careGroupResidents).values(data);
  }
}

export async function removeResidentFromGroup(careGroupId: number, residentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(careGroupResidents).where(and(
    eq(careGroupResidents.careGroupId, careGroupId),
    eq(careGroupResidents.residentId, residentId)
  ));
}

// ============ SCHEDULED TASKS HELPERS ============

export async function getScheduledTasks(filters: {
  dateFrom?: Date;
  dateTo?: Date;
  residentId?: number;
  status?: string;
  careTypeId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = [];
  
  if (filters.dateFrom && filters.dateTo) {
    conditions.push(between(scheduledTasks.scheduledDateTime, filters.dateFrom, filters.dateTo));
  } else if (filters.dateFrom) {
    conditions.push(gte(scheduledTasks.scheduledDateTime, filters.dateFrom));
  } else if (filters.dateTo) {
    conditions.push(lte(scheduledTasks.scheduledDateTime, filters.dateTo));
  }
  
  if (filters.residentId) {
    conditions.push(eq(scheduledTasks.residentId, filters.residentId));
  }
  
  if (filters.status) {
    conditions.push(eq(scheduledTasks.status, filters.status as any));
  }
  
  if (filters.careTypeId) {
    conditions.push(eq(scheduledTasks.careTypeId, filters.careTypeId));
  }
  
  const result = await db.select()
    .from(scheduledTasks)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(scheduledTasks.scheduledDateTime);
  
  return result;
}

export async function getScheduledTaskById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(scheduledTasks).where(eq(scheduledTasks.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createScheduledTask(task: InsertScheduledTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(scheduledTasks).values(task);
  return result;
}

export async function executeScheduledTask(id: number, data: {
  executedByUserId: number;
  resultValue?: string;
  resultNumeric?: number;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(scheduledTasks).set({
    status: "completed",
    executionDateTime: new Date(),
    executedByUserId: data.executedByUserId,
    resultValue: data.resultValue,
    resultNumeric: data.resultNumeric?.toString(),
    notes: data.notes,
  }).where(eq(scheduledTasks.id, id));
}

export async function updateScheduledTaskStatus(id: number, status: "pending" | "completed" | "not_done" | "absent" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(scheduledTasks).set({ status }).where(eq(scheduledTasks.id, id));
}

// ============ ULCER MANAGEMENT HELPERS ============

export async function getUlcersByResident(residentId: number, activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = [eq(ulcers.residentId, residentId)];
  if (activeOnly) {
    conditions.push(eq(ulcers.isActive, true));
  }
  
  const result = await db.select()
    .from(ulcers)
    .where(and(...conditions))
    .orderBy(desc(ulcers.onsetDate));
  
  return result;
}

export async function createUlcer(ulcer: InsertUlcer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(ulcers).values(ulcer);
  return result;
}

export async function updateUlcer(id: number, data: Partial<InsertUlcer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(ulcers).set(data).where(eq(ulcers.id, id));
}

export async function getUlcerCures(ulcerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select()
    .from(ulcerCures)
    .where(eq(ulcerCures.ulcerId, ulcerId))
    .orderBy(desc(ulcerCures.performedAt));
  
  return result;
}

export async function addUlcerCure(cure: InsertUlcerCure) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(ulcerCures).values(cure);
  return result;
}

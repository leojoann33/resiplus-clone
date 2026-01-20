import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { sql, and, gte, lt } from "drizzle-orm";
import { scheduledTasks } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ RESIDENTS ROUTER ============
  residents: router({
    list: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        searchTerm: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllResidents(input);
      }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getResidentById(input.id);
      }),
       create: protectedProcedure
      .input(
        z.object({
          code: z.string(),
          nif: z.string().optional(),
          nss: z.string().optional(),
          nsip: z.string().optional(),
          firstName: z.string(),
          lastName: z.string(),
          birthDate: z.string().optional(),
          gender: z.enum(["male", "female", "other"]).optional(),
          admissionDate: z.string(),
          lastAdmissionDate: z.string().optional(),
          birthPlace: z.string().optional(),
          roomId: z.number().optional(),
          bedNumber: z.number().optional(),
          status: z.enum(["active", "discharged", "deceased"]).optional(),
          contactPhone: z.string().optional(),
          contactEmail: z.string().optional(),
          emergencyContactName: z.string().optional(),
          emergencyContactPhone: z.string().optional(),
          emergencyContactRelation: z.string().optional(),
          notes: z.string().optional(),
          medicalNotes: z.string().optional(),
          allergies: z.string().optional(),
          specialNeeds: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const residentData: any = {
          ...input,
          createdBy: ctx.user.id,
        };
        if (input.birthDate) residentData.birthDate = new Date(input.birthDate);
        if (input.admissionDate) residentData.admissionDate = new Date(input.admissionDate);
        if (input.lastAdmissionDate) residentData.lastAdmissionDate = new Date(input.lastAdmissionDate);
        return await db.createResident(residentData);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          code: z.string().optional(),
          nif: z.string().optional(),
          nss: z.string().optional(),
          nsip: z.string().optional(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          birthDate: z.string().optional(),
          gender: z.enum(["male", "female", "other"]).optional(),
          admissionDate: z.string().optional(),
          lastAdmissionDate: z.string().optional(),
          birthPlace: z.string().optional(),
          roomId: z.number().optional(),
          bedNumber: z.number().optional(),
          status: z.enum(["active", "discharged", "deceased"]).optional(),
          contactPhone: z.string().optional(),
          contactEmail: z.string().optional(),
          emergencyContactName: z.string().optional(),
          emergencyContactPhone: z.string().optional(),
          emergencyContactRelation: z.string().optional(),
          notes: z.string().optional(),
          medicalNotes: z.string().optional(),
          allergies: z.string().optional(),
          specialNeeds: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const updateData: any = { ...input };
        if (input.birthDate) updateData.birthDate = new Date(input.birthDate);
        if (input.admissionDate) updateData.admissionDate = new Date(input.admissionDate);
        if (input.lastAdmissionDate) updateData.lastAdmissionDate = new Date(input.lastAdmissionDate);
        return await db.updateResident(input.id, updateData);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteResident(input.id);
        return { success: true };
      }),
  }),

  // ============ ROOMS ROUTER ============
  rooms: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllRooms();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getRoomById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        code: z.string(),
        name: z.string(),
        roomType: z.enum(["single", "double", "triple", "shared"]),
        floor: z.number().optional(),
        wing: z.string().optional(),
        totalBeds: z.number(),
        availableBeds: z.number(),
        hasPrivateBathroom: z.boolean().optional(),
        hasBalcony: z.boolean().optional(),
        isAccessible: z.boolean().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createRoom(input as any);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().optional(),
        name: z.string().optional(),
        roomType: z.enum(["single", "double", "triple", "shared"]).optional(),
        floor: z.number().optional(),
        wing: z.string().optional(),
        totalBeds: z.number().optional(),
        availableBeds: z.number().optional(),
        hasPrivateBathroom: z.boolean().optional(),
        hasBalcony: z.boolean().optional(),
        isAccessible: z.boolean().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateRoom(id, data as any);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteRoom(input.id);
        return { success: true };
      }),
  }),

  // ============ VITAL SIGNS ROUTER ============
  vitalSigns: router({
    create: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        measurementType: z.enum([
          "blood_pressure",
          "heart_rate",
          "respiratory_rate",
          "oxygen_saturation",
          "temperature",
          "glucose",
          "weight"
        ]),
        systolicBP: z.number().optional(),
        diastolicBP: z.number().optional(),
        heartRate: z.number().optional(),
        respiratoryRate: z.number().optional(),
        oxygenSaturation: z.number().optional(),
        temperature: z.number().optional(),
        glucose: z.number().optional(),
        weight: z.number().optional(),
        notes: z.string().optional(),
        measurementDate: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const vitalSignData: any = {
          ...input,
          measurementDate: new Date(input.measurementDate),
          recordedBy: ctx.user.id,
        };
        
        return await db.createVitalSign(vitalSignData);
      }),
    
    listByResident: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getVitalSignsByResidentId(input.residentId, input.limit);
      }),
    
    listByType: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        measurementType: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getVitalSignsByType(input.residentId, input.measurementType);
      }),
  }),

  // ============ ASSESSMENT SCALES ROUTER ============
  assessmentScales: router({
    create: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        scaleType: z.enum(["barthel", "norton"]),
        totalScore: z.number(),
        assessmentDate: z.string(),
        assessmentData: z.string(), // JSON string
        interpretation: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const assessmentData: any = {
          ...input,
          assessmentDate: new Date(input.assessmentDate),
          assessedBy: ctx.user.id,
        };
        
        return await db.createAssessmentScale(assessmentData);
      }),
    
    listByResident: protectedProcedure
      .input(z.object({ residentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAssessmentScalesByResidentId(input.residentId);
      }),
    
    listByType: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        scaleType: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getAssessmentScalesByType(input.residentId, input.scaleType);
      }),
  }),

  // ============ MEDICATIONS ROUTER ============
  medications: router({
    create: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        medicationName: z.string(),
        activeIngredient: z.string().optional(),
        dosage: z.string(),
        unit: z.string(),
        administrationRoute: z.enum([
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
        ]),
        frequency: z.string(),
        scheduleType: z.enum(["acute", "chronic"]),
        startDate: z.string(),
        endDate: z.string().optional(),
        monday: z.boolean().optional(),
        tuesday: z.boolean().optional(),
        wednesday: z.boolean().optional(),
        thursday: z.boolean().optional(),
        friday: z.boolean().optional(),
        saturday: z.boolean().optional(),
        sunday: z.boolean().optional(),
        administrationTimes: z.string(), // JSON array
        indication: z.string().optional(),
        prescribedBy: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const medicationData: any = {
          ...input,
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : null,
          createdBy: ctx.user.id,
        };
        
        return await db.createMedication(medicationData);
      }),
    
    listByResident: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        activeOnly: z.boolean().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getMedicationsByResidentId(input.residentId, input.activeOnly ?? true);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        medicationName: z.string().optional(),
        activeIngredient: z.string().optional(),
        dosage: z.string().optional(),
        unit: z.string().optional(),
        administrationRoute: z.enum([
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
        ]).optional(),
        frequency: z.string().optional(),
        scheduleType: z.enum(["acute", "chronic"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        monday: z.boolean().optional(),
        tuesday: z.boolean().optional(),
        wednesday: z.boolean().optional(),
        thursday: z.boolean().optional(),
        friday: z.boolean().optional(),
        saturday: z.boolean().optional(),
        sunday: z.boolean().optional(),
        administrationTimes: z.string().optional(),
        indication: z.string().optional(),
        prescribedBy: z.string().optional(),
        notes: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);
        
        await db.updateMedication(id, updateData);
        return { success: true };
      }),
    
    deactivate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deactivateMedication(input.id);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMedication(input.id);
        return { success: true };
      }),
  }),

  // ============ NURSING ROUTER ============
  nursing: router({
    getVitalSignsByResident: protectedProcedure
      .input(z.object({ residentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getVitalSignsByResidentId(input.residentId);
      }),
    
    getScalesByResident: protectedProcedure
      .input(z.object({ residentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAssessmentScalesByResidentId(input.residentId);
      }),
  }),

  // ============ NURSING NOTES ROUTER ============
  nursingNotes: router({
    create: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        category: z.enum([
          "general",
          "vital_signs",
          "medication",
          "nutrition",
          "hygiene",
          "mobility",
          "behavior",
          "wound_care",
          "incident"
        ]),
        title: z.string(),
        content: z.string(),
        priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
        noteDate: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const noteData: any = {
          ...input,
          noteDate: new Date(input.noteDate),
          recordedBy: ctx.user.id,
        };
        
        return await db.createNursingNote(noteData);
      }),
    
    listByResident: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getNursingNotesByResidentId(input.residentId, input.limit);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        category: z.enum([
          "general",
          "vital_signs",
          "medication",
          "nutrition",
          "hygiene",
          "mobility",
          "behavior",
          "wound_care",
          "incident"
        ]).optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
        noteDate: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        
        if (data.noteDate) updateData.noteDate = new Date(data.noteDate);
        
        await db.updateNursingNote(id, updateData);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteNursingNote(input.id);
        return { success: true };
      }),
  }),

  // ============ CARE PLANNING ROUTER ============
  carePlanning: router({
    getTodayControlsCount: protectedProcedure.query(async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const result = await db.getDb().then(db => 
        db.select({ count: sql<number>`count(*)` })
          .from(scheduledTasks)
          .where(
            and(
              gte(scheduledTasks.scheduledDateTime, today),
              lt(scheduledTasks.scheduledDateTime, tomorrow)
            )
          )
      );
      
      return result[0]?.count || 0;
    }),
    // --- Care Types ---
    getCareTypes: protectedProcedure
      .input(z.object({ activeOnly: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllCareTypes(input?.activeOnly ?? true);
      }),

    getCareTypeById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCareTypeById(input.id);
      }),

    createCareType: protectedProcedure
      .input(z.object({
        code: z.string(),
        name: z.string(),
        category: z.enum(["control", "actividad", "registro"]),
        professionalArea: z.enum([
          "enfermeria", "trabajador_social", "psicologo", "fisioterapeuta",
          "terapeuta_ocupacional", "animador", "educador", "dietista", "logopeda", "medico"
        ]).optional(),
        requiresResult: z.boolean().optional(),
        resultType: z.enum(["numeric", "text", "boolean", "scale"]).optional(),
        resultUnit: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createCareType(input as any);
      }),

    updateCareType: protectedProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().optional(),
        name: z.string().optional(),
        category: z.enum(["control", "actividad", "registro"]).optional(),
        professionalArea: z.string().optional(),
        requiresResult: z.boolean().optional(),
        resultType: z.enum(["numeric", "text", "boolean", "scale"]).optional(),
        resultUnit: z.string().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCareType(id, data as any);
        return { success: true };
      }),

    deleteCareType: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCareType(input.id);
        return { success: true };
      }),

    // --- Care Tasks ---
    getCareTasksByResident: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        activeOnly: z.boolean().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getCareTasksByResidentId(input.residentId, input.activeOnly ?? true);
      }),

    getCareTaskById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCareTaskById(input.id);
      }),

    createCareTask: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        careTypeId: z.number(),
        subtype: z.string().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
        scheduledHour: z.string().optional(),
        recurrenceType: z.enum(["none", "daily", "weekly", "monthly", "custom"]).optional(),
        recurrencePattern: z.string().optional(), // JSON
        professionalArea: z.string().optional(),
        assignedUserId: z.number().optional(),
        indication: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const taskData: any = {
          ...input,
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : null,
          createdBy: ctx.user.id,
        };
        return await db.createCareTask(taskData);
      }),

    updateCareTask: protectedProcedure
      .input(z.object({
        id: z.number(),
        careTypeId: z.number().optional(),
        subtype: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        scheduledHour: z.string().optional(),
        recurrenceType: z.enum(["none", "daily", "weekly", "monthly", "custom"]).optional(),
        recurrencePattern: z.string().optional(),
        professionalArea: z.string().optional(),
        assignedUserId: z.number().optional(),
        indication: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["active", "paused", "completed", "cancelled"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.endDate) updateData.endDate = new Date(data.endDate);
        await db.updateCareTask(id, updateData);
        return { success: true };
      }),

    deleteCareTask: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCareTask(input.id);
        return { success: true };
      }),

    // --- Care Groups ---
    getCareGroups: protectedProcedure
      .input(z.object({ activeOnly: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllCareGroups(input?.activeOnly ?? true);
      }),

    getCareGroupById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCareGroupById(input.id);
      }),

    createCareGroup: protectedProcedure
      .input(z.object({
        name: z.string(),
        groupType: z.enum(["control", "actividad"]).optional(),
        careTypeId: z.number().optional(),
        code: z.string().optional(),
        codeUnificado: z.string().optional(),
        professionalArea: z.string().optional(),
        scheduledHour: z.string().optional(),
        recurrencePattern: z.string().optional(), // JSON
        assignedUserId: z.number().optional(),
        durationHours: z.number().optional(),
        indication: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const groupData: any = {
          ...input,
          createdBy: ctx.user.id,
        };
        return await db.createCareGroup(groupData);
      }),

    updateCareGroup: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        groupType: z.enum(["control", "actividad"]).optional(),
        careTypeId: z.number().optional(),
        code: z.string().optional(),
        codeUnificado: z.string().optional(),
        professionalArea: z.string().optional(),
        scheduledHour: z.string().optional(),
        recurrencePattern: z.string().optional(),
        assignedUserId: z.number().optional(),
        durationHours: z.number().optional(),
        indication: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCareGroup(id, data as any);
        return { success: true };
      }),

    deleteCareGroup: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCareGroup(input.id);
        return { success: true };
      }),

    // --- Care Group Residents ---
    getCareGroupResidents: protectedProcedure
      .input(z.object({ careGroupId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCareGroupResidents(input.careGroupId);
      }),

    addResidentToGroup: protectedProcedure
      .input(z.object({
        careGroupId: z.number(),
        residentId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.addResidentToGroup({
          careGroupId: input.careGroupId,
          residentId: input.residentId,
          addedBy: ctx.user.id,
        });
        return { success: true };
      }),

    removeResidentFromGroup: protectedProcedure
      .input(z.object({
        careGroupId: z.number(),
        residentId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.removeResidentFromGroup(input.careGroupId, input.residentId);
        return { success: true };
      }),

    // --- Scheduled Tasks ---
    getScheduledTasks: protectedProcedure
      .input(z.object({
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        residentId: z.number().optional(),
        status: z.enum(["pending", "completed", "not_done", "absent", "cancelled"]).optional(),
        careTypeId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const filters: any = { ...input };
        if (input.dateFrom) filters.dateFrom = new Date(input.dateFrom);
        if (input.dateTo) filters.dateTo = new Date(input.dateTo);
        return await db.getScheduledTasks(filters);
      }),

    getScheduledTaskById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getScheduledTaskById(input.id);
      }),

    createScheduledTask: protectedProcedure
      .input(z.object({
        careTaskId: z.number().optional(),
        careGroupId: z.number().optional(),
        residentId: z.number(),
        careTypeId: z.number(),
        scheduledDateTime: z.string(),
        taskType: z.enum(["individual", "group"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const taskData: any = {
          ...input,
          scheduledDateTime: new Date(input.scheduledDateTime),
        };
        return await db.createScheduledTask(taskData);
      }),

    executeScheduledTask: protectedProcedure
      .input(z.object({
        id: z.number(),
        resultValue: z.string().optional(),
        resultNumeric: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.executeScheduledTask(input.id, {
          executedByUserId: ctx.user.id,
          resultValue: input.resultValue,
          resultNumeric: input.resultNumeric,
          notes: input.notes,
        });
        return { success: true };
      }),

    updateScheduledTaskStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "completed", "not_done", "absent", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateScheduledTaskStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // ============ ULCER MANAGEMENT ROUTER ============
  ulcers: router({
    create: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        code: z.string().optional(),
        onsetDate: z.string(),
        healDate: z.string().optional(),
        location: z.string(),
        stage: z.string(),
        size: z.string().optional(),
        riskFactors: z.string().optional(), // JSON
        observations: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const ulcerData: any = {
          ...input,
          onsetDate: input.onsetDate, // Pass string directly (YYYY-MM-DD)
          healDate: input.healDate || null, // Pass string directly or null
          createdBy: typeof ctx.user.id === 'number' ? ctx.user.id : 1, // Fallback to 1 for dummy auth
        };
        return await db.createUlcer(ulcerData);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        code: z.string().optional(),
        onsetDate: z.string().optional(),
        healDate: z.string().optional(),
        location: z.string().optional(),
        stage: z.string().optional(),
        size: z.string().optional(),
        riskFactors: z.string().optional(),
        observations: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        // Pass strings directly
        if (data.onsetDate === undefined) delete updateData.onsetDate;
        if (data.healDate === undefined) delete updateData.healDate;
        
        await db.updateUlcer(id, updateData);
        return { success: true };
      }),

    listByResident: protectedProcedure
      .input(z.object({
        residentId: z.number(),
        activeOnly: z.boolean().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getUlcersByResident(input.residentId, input.activeOnly ?? true);
      }),

    // --- Cures ---
    addCure: protectedProcedure
      .input(z.object({
        ulcerId: z.number(),
        treatment: z.string().optional(),
        observations: z.string().optional(),
        nextCure: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const cureData: any = {
          ...input,
          performedBy: typeof ctx.user.id === 'number' ? ctx.user.id : 1,
          nextCure: input.nextCure || null,
        };
        return await db.addUlcerCure(cureData);
      }),

    getCures: protectedProcedure
      .input(z.object({ ulcerId: z.number() }))
      .query(async ({ input }) => {
        return await db.getUlcerCures(input.ulcerId);
      }),
  }),
});

export type AppRouter = typeof appRouter;

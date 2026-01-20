import { router, protectedProcedure } from "./trpc";
import { z } from "zod";
import * as dbMedical from "./db_medical";

export const medicalRouter = router({
  // ============= Pathologies =============
  pathologies: router({
    create: protectedProcedure
      .input(
        z.object({
          residentId: z.number(),
          cieCode: z.string(),
          description: z.string(),
          unifiedCode: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.createPathology({
          residentId: input.residentId,
          cieCode: input.cieCode,
          description: input.description,
          unifiedCode: input.unifiedCode,
          isActive: true,
        });
      }),

    list: protectedProcedure
      .input(z.object({ residentId: z.number() }))
      .query(async ({ input }) => {
        return await dbMedical.getResidentPathologies(input.residentId);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          description: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.updatePathology(input.id, {
          description: input.description,
          isActive: input.isActive,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await dbMedical.deletePathology(input.id);
      }),
  }),

  // ============= Allergies =============
  allergies: router({
    create: protectedProcedure
      .input(
        z.object({
          residentId: z.number(),
          allergyCode: z.string(),
          description: z.string(),
          severity: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.createAllergy({
          residentId: input.residentId,
          allergyCode: input.allergyCode,
          description: input.description,
          severity: input.severity,
          isActive: true,
        });
      }),

    list: protectedProcedure
      .input(z.object({ residentId: z.number() }))
      .query(async ({ input }) => {
        return await dbMedical.getResidentAllergies(input.residentId);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          description: z.string().optional(),
          severity: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.updateAllergy(input.id, {
          description: input.description,
          severity: input.severity,
          isActive: input.isActive,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await dbMedical.deleteAllergy(input.id);
      }),
  }),

  // ============= Medical Antecedents =============
  antecedents: router({
    create: protectedProcedure
      .input(
        z.object({
          residentId: z.number(),
          antecedentCode: z.string(),
          description: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.createMedicalAntecedent({
          residentId: input.residentId,
          antecedentCode: input.antecedentCode,
          description: input.description,
          isActive: true,
        });
      }),

    list: protectedProcedure
      .input(z.object({ residentId: z.number() }))
      .query(async ({ input }) => {
        return await dbMedical.getResidentAntecedents(input.residentId);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          description: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.updateMedicalAntecedent(input.id, {
          description: input.description,
          isActive: input.isActive,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await dbMedical.deleteMedicalAntecedent(input.id);
      }),
  }),

  // ============= Treatments =============
  treatments: router({
    create: protectedProcedure
      .input(
        z.object({
          residentId: z.number(),
          orderDate: z.string(),
          doctorId: z.string().optional(),
          observations: z.string().optional(),
          createdBy: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.createTreatment({
          residentId: input.residentId,
          orderDate: new Date(input.orderDate),
          doctorId: input.doctorId,
          observations: input.observations,
          createdBy: input.createdBy,
          status: "active",
        });
      }),

    list: protectedProcedure
      .input(z.object({ residentId: z.number() }))
      .query(async ({ input }) => {
        return await dbMedical.getResidentTreatments(input.residentId);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await dbMedical.getTreatmentById(input.id);
        return result[0] || null;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          observations: z.string().optional(),
          status: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.updateTreatment(input.id, {
          observations: input.observations,
          status: input.status,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await dbMedical.deleteTreatment(input.id);
      }),
  }),

  // ============= Medications =============
  medications: router({
    create: protectedProcedure
      .input(
        z.object({
          treatmentId: z.number(),
          medicationName: z.string(),
          startDate: z.string(),
          endDate: z.string().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
          daysOfWeek: z.string().optional(),
          intervals: z.string().optional(),
          administrationRoute: z.string().optional(),
          unit: z.string().optional(),
          pathology: z.string().optional(),
          specialNotes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.createMedication({
          treatmentId: input.treatmentId,
          medicationName: input.medicationName,
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          startTime: input.startTime,
          endTime: input.endTime,
          daysOfWeek: input.daysOfWeek,
          intervals: input.intervals,
          administrationRoute: input.administrationRoute,
          unit: input.unit,
          pathology: input.pathology,
          specialNotes: input.specialNotes,
        });
      }),

    listByTreatment: protectedProcedure
      .input(z.object({ treatmentId: z.number() }))
      .query(async ({ input }) => {
        return await dbMedical.getTreatmentMedications(input.treatmentId);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          medicationName: z.string().optional(),
          endDate: z.string().optional(),
          daysOfWeek: z.string().optional(),
          intervals: z.string().optional(),
          specialNotes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.updateMedication(input.id, {
          medicationName: input.medicationName,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          daysOfWeek: input.daysOfWeek,
          intervals: input.intervals,
          specialNotes: input.specialNotes,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await dbMedical.deleteMedication(input.id);
      }),
  }),

  // ============= Medical Procedures =============
  procedures: router({
    create: protectedProcedure
      .input(
        z.object({
          residentId: z.number(),
          procedureCode: z.string(),
          description: z.string(),
          procedureDate: z.string(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.createMedicalProcedure({
          residentId: input.residentId,
          procedureCode: input.procedureCode,
          description: input.description,
          procedureDate: new Date(input.procedureDate),
          notes: input.notes,
        });
      }),

    list: protectedProcedure
      .input(z.object({ residentId: z.number() }))
      .query(async ({ input }) => {
        return await dbMedical.getResidentProcedures(input.residentId);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          description: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await dbMedical.updateMedicalProcedure(input.id, {
          description: input.description,
          notes: input.notes,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await dbMedical.deleteMedicalProcedure(input.id);
      }),
  }),
});

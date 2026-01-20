import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("residents CRUD operations", () => {
  it("should create a resident with all fields", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const newResident = {
      code: `TEST-CRUD-${Date.now()}`,
      firstName: "Test",
      lastName: "CRUD",
      nif: "12345678Z",
      nss: "281234567890",
      birthDate: "1950-01-01",
      gender: "male" as const,
      admissionDate: "2024-01-01",
      status: "active" as const,
      contactPhone: "612345678",
      medicalNotes: "Test medical notes",
      allergies: "Test allergies",
      specialNeeds: "Test special needs",
    };

    const result = await caller.residents.create(newResident);

    expect(result).toBeDefined();
  });

  it("should update a resident", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a resident
    const newResident = {
      code: `TEST-UPDATE-${Date.now()}`,
      firstName: "Original",
      lastName: "Name",
      admissionDate: "2024-01-01",
    };

    const created = await caller.residents.create(newResident);

    // Then update it
    const updated = await caller.residents.update({
      id: created.id,
      firstName: "Updated",
      lastName: "Name",
      medicalNotes: "Updated medical notes",
    });

    expect(updated).toBeDefined();
  });

  it("should retrieve a resident by ID", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create a resident
    const newResident = {
      code: `TEST-GET-${Date.now()}`,
      firstName: "Get",
      lastName: "Test",
      admissionDate: "2024-01-01",
    };

    const created = await caller.residents.create(newResident);

    // Retrieve it
    const retrieved = await caller.residents.getById({ id: created.id });

    expect(retrieved).toBeDefined();
    expect(retrieved?.firstName).toBe("Get");
    expect(retrieved?.lastName).toBe("Test");
  });
});

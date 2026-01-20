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

describe("residents router", () => {
  it("should list residents", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.residents.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("should create a resident", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const newResident = {
      code: `TEST-${Date.now()}`,
      firstName: "Juan",
      lastName: "Pérez",
      admissionDate: new Date().toISOString(),
    };

    const result = await caller.residents.create(newResident);

    expect(result).toBeDefined();
  });

  it("should filter residents by search term", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.residents.list({ searchTerm: "TEST" });

    expect(Array.isArray(result)).toBe(true);
  });
});

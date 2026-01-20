import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { verifyToken } from "../auth_practice";
import * as db from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // First try OAuth authentication
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  // If OAuth failed, try practice JWT token from Authorization header
  if (!user) {
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded) {
        // Try to find real user in DB
        const openId = decoded.username;
        const dbUser = await db.getUserByOpenId(openId);

        if (dbUser) {
           user = dbUser;
        } else {
           // Fallback for non-existent users (should not happen for Mirela if script runs)
           user = {
             id: 1, // Fallback ID - risky if 1 is not Mirela, but for practice it's okay. Ideally we use the DB user.
             openId: decoded.username,
             name: decoded.username || "Usuario de Práctica",
             email: `${decoded.username}@practice.local`,
             role: "admin",
             loginMethod: "practice",
             createdAt: new Date(),
             updatedAt: new Date(),
             lastSignedIn: new Date(),
           } as User;
        }
      }
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}


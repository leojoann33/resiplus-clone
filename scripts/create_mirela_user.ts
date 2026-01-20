
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection);

async function main() {
  console.log("Checking for Mirela Petrescu user...");

  const targetOpenId = "mirela-petrescu";

  // Check if user exists
  const existingUser = await db.select().from(users).where(eq(users.openId, targetOpenId)).limit(1);

  if (existingUser.length > 0) {
    console.log("User 'Mirela Petrescu' already exists.");
    // Optionally update user if needed, but for now we just log
    await db.update(users).set({
        name: "Mirela Petrescu",
        role: "admin",
        loginMethod: "practice"
    }).where(eq(users.openId, targetOpenId));
    console.log("User details updated.");
  } else {
    // Create new user
    console.log("User not found. Creating...");
    await db.insert(users).values({
      openId: targetOpenId,
      name: "Mirela Petrescu",
      role: "admin",
      loginMethod: "practice",
      // email is optional, but we can add dummy if needed
      email: "mirela.petrescu@resiplus.local"
    });
    console.log("User 'Mirela Petrescu' created successfully.");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

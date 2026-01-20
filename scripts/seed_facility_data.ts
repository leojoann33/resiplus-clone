import { 
  getDb, 
  createRoom, 
  getAllResidents, 
  updateResident 
} from "../server/db";
import { 
  rooms, 
  scheduledTasks, 
  careTypes 
} from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import "dotenv/config";

async function seedFacilityData() {
  console.log("🏥 Starting Facility Data Seeding for 'Emera Guadalajara'...");

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // 1. Clear existing rooms to avoid duplicates (optional, strictly for this seed)
  // Be careful in production, but this is a clone/practice env.
  console.log("🧹 Clearing existing rooms...");
  await db.delete(rooms);

  // 2. Create Rooms
  // Structure: 3 Floors. 
  // Floor 0: Reception/Offices (No residents mostly, maybe some nursing)
  // Floor 1: 20 rooms (101-120)
  // Floor 2: 25 rooms (201-225)
  // Floor 3: 25 rooms (301-325)
  // Total: 70 rooms.
  // Types: 20% Single, 80% Double.
  
  const floors = [
    { level: 1, count: 20, start: 101 },
    { level: 2, count: 25, start: 201 },
    { level: 3, count: 25, start: 301 },
  ];

  let totalBeds = 0;
  const createdRooms = [];

  for (const floor of floors) {
    for (let i = 0; i < floor.count; i++) {
      const roomNum = floor.start + i;
      // Randomly assign single or double (weighted to double)
      const isSingle = Math.random() < 0.2; 
      const type = isSingle ? "single" : "double";
      const beds = isSingle ? 1 : 2;

      const room = await createRoom({
        code: `${roomNum}`,
        name: `Habitación ${roomNum}`,
        roomType: type,
        floor: floor.level,
        wing: floor.level === 1 ? "Ala Norte" : "General",
        totalBeds: beds,
        availableBeds: beds, // Initially empty
        hasPrivateBathroom: true,
        isAccessible: true,
      });
      
      // createRoom might not return the ID depending on implementation, 
      // but we can query or assume success. 
      // Actually createRoom in db.ts returns void or result.
      // We will need to query them back or just trust the process.
      // To link residents, we need room IDs.
      
      totalBeds += beds;
    }
  }
  
  console.log(`✅ Created ~${floors.reduce((a,b)=>a+b.count,0)} rooms with approx ${totalBeds} beds.`);

  // 3. Fetch all Rooms to allow assignment
  const allRooms = await db.select().from(rooms);
  
  // 4. Assign Residents
  console.log("👥 Assigning existing residents to rooms...");
  const residentsList = await getAllResidents({ status: "active" });
  
  let residentIdx = 0;
  for (const room of allRooms) {
    if (residentIdx >= residentsList.length) break;
    
    // Fill this room
    const capacity = room.totalBeds;
    let occupied = 0;
    
    // Try to fill beds 1 and 2
    for (let bed = 1; bed <= capacity; bed++) {
      if (residentIdx >= residentsList.length) break;
      
      const resident = residentsList[residentIdx];
      
      await updateResident(resident.id, {
        roomId: room.id,
        bedNumber: bed
      });
      
      occupied++;
      residentIdx++;
    }
    
    // Update room availability
    await db.update(rooms)
      .set({ availableBeds: capacity - occupied })
      .where(eq(rooms.id, room.id));
  }
  
  console.log(`✅ Assigned ${residentIdx} residents to beds.`);

  // 5. Generate Today's Tasks (for Dashboard "Controles Hoy")
  console.log("📅 Generating daily controls for today...");
  
  // Find "Control TA" care type and "Glucemia" or similar
  const existingCareTypes = await db.select().from(careTypes);
  const taType = existingCareTypes.find(c => c.name.includes("Tensión") || c.name.includes("TA") || c.code === "control_ta");
  const dietType = existingCareTypes.find(c => c.name.includes("Desayuno")); // hypothetical
  
  // Use a fallback ID if not found, or just pick simple ones
  const targetCareTypeId = taType?.id || existingCareTypes[0]?.id;
  
  if (!targetCareTypeId) {
    console.warn("⚠️ No care types found to generate tasks. Skipping.");
  } else {
    const today = new Date();
    today.setHours(8, 0, 0, 0); // Morning tasks

    for (const resident of residentsList) {
        // Create 1-3 tasks per resident
        const taskCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < taskCount; i++) {
            const isCompleted = Math.random() > 0.6; // 40% Pending
            const scheduledTime = new Date(today);
            scheduledTime.setHours(8 + (i*4)); // 8:00, 12:00, 16:00

            await db.insert(scheduledTasks).values({
                residentId: resident.id,
                careTypeId: targetCareTypeId,
                scheduledDateTime: scheduledTime,
                status: isCompleted ? "completed" : "pending",
                executedByUserId: isCompleted ? 1 : null, // Assuming user 1 exists
                resultValue: isCompleted ? "120/80" : null,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    }
    console.log(`✅ Generated tasks for ${residentsList.length} residents.`);
  }

  console.log("✨ Facility Data Seeding Completed!");
  process.exit(0);
}

seedFacilityData().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

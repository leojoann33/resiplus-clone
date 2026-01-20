import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const connection = await mysql.createConnection(DATABASE_URL);

    // Insert sample rooms
    await connection.execute(`
      INSERT INTO rooms (code, name, roomType, floor, wing, totalBeds, availableBeds, hasPrivateBathroom, hasBalcony, isAccessible)
      VALUES 
        ('H101', 'Habitación 101', 'single', 1, 'A', 1, 1, 1, 0, 1),
        ('H102', 'Habitación 102', 'double', 1, 'A', 2, 1, 1, 1, 1),
        ('H201', 'Habitación 201', 'single', 2, 'B', 1, 0, 1, 0, 0),
        ('H202', 'Habitación 202', 'double', 2, 'B', 2, 2, 0, 1, 1),
        ('H301', 'Habitación 301', 'triple', 3, 'C', 3, 1, 1, 1, 1)
      ON DUPLICATE KEY UPDATE code=code
    `);

    console.log("✓ Rooms inserted");

    // Insert sample residents
    await connection.execute(`
      INSERT INTO residents (code, nif, nss, firstName, lastName, birthDate, gender, admissionDate, roomId, bedNumber, status, contactPhone, emergencyContactName, emergencyContactPhone, emergencyContactRelation, createdBy)
      VALUES 
        ('R001', '12345678A', '281234567890', 'María', 'García López', '1940-05-15', 'female', '2023-01-10', 1, 1, 'active', '612345678', 'Ana García', '623456789', 'Hija', 1),
        ('R002', '23456789B', '281234567891', 'José', 'Martínez Pérez', '1938-08-22', 'male', '2023-02-15', 2, 1, 'active', '634567890', 'Pedro Martínez', '645678901', 'Hijo', 1),
        ('R003', '34567890C', '281234567892', 'Carmen', 'Rodríguez Sánchez', '1942-11-30', 'female', '2023-03-20', 3, 1, 'active', '656789012', 'Luis Rodríguez', '667890123', 'Hijo', 1),
        ('R004', '45678901D', '281234567893', 'Antonio', 'López Fernández', '1935-03-12', 'male', '2023-04-05', 5, 1, 'active', '678901234', 'María López', '689012345', 'Hija', 1),
        ('R005', '56789012E', '281234567894', 'Isabel', 'González Ruiz', '1945-07-18', 'female', '2023-05-12', 5, 2, 'active', '690123456', 'Juan González', '601234567', 'Hijo', 1)
      ON DUPLICATE KEY UPDATE code=code
    `);

    console.log("✓ Residents inserted");

    // Insert sample vital signs
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, systolicBP, diastolicBP, measurementDate, recordedBy)
      VALUES 
        (1, 'blood_pressure', 130, 80, ?, 1),
        (1, 'blood_pressure', 125, 78, ?, 1),
        (2, 'blood_pressure', 140, 85, ?, 1)
    `, [now, yesterday, now]);

    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, heartRate, measurementDate, recordedBy)
      VALUES 
        (1, 'heart_rate', 72, ?, 1),
        (2, 'heart_rate', 68, ?, 1),
        (3, 'heart_rate', 75, ?, 1)
    `, [now, now, yesterday]);

    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, temperature, measurementDate, recordedBy)
      VALUES 
        (1, 'temperature', 36.5, ?, 1),
        (2, 'temperature', 36.8, ?, 1),
        (3, 'temperature', 36.3, ?, 1)
    `, [now, yesterday, twoDaysAgo]);

    console.log("✓ Vital signs inserted");

    // Insert sample medications
    await connection.execute(`
      INSERT INTO medications (residentId, medicationName, activeIngredient, dosage, unit, administrationRoute, frequency, scheduleType, startDate, monday, tuesday, wednesday, thursday, friday, saturday, sunday, administrationTimes, prescribedBy, createdBy)
      VALUES 
        (1, 'Enalapril', 'Enalapril maleato', '10', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2023-01-10', 1, 1, 1, 1, 1, 1, 1, '["08:00"]', 'Dr. Ramírez', 1),
        (1, 'Omeprazol', 'Omeprazol', '20', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2023-01-10', 1, 1, 1, 1, 1, 1, 1, '["08:00"]', 'Dr. Ramírez', 1),
        (2, 'Metformina', 'Metformina clorhidrato', '850', 'mg', 'oral', 'Cada 12 horas', 'chronic', '2023-02-15', 1, 1, 1, 1, 1, 1, 1, '["08:00","20:00"]', 'Dr. García', 1),
        (3, 'Paracetamol', 'Paracetamol', '1000', 'mg', 'oral', 'Cada 8 horas', 'acute', '2024-01-10', 1, 1, 1, 1, 1, 1, 1, '["08:00","16:00","00:00"]', 'Dr. López', 1)
      ON DUPLICATE KEY UPDATE medicationName=medicationName
    `);

    console.log("✓ Medications inserted");

    // Insert sample nursing notes
    await connection.execute(`
      INSERT INTO nursingNotes (residentId, category, title, content, priority, noteDate, recordedBy)
      VALUES 
        (1, 'general', 'Revisión general', 'Residente en buen estado general. Colaboradora y orientada.', 'normal', ?, 1),
        (2, 'vital_signs', 'Tensión elevada', 'Se registra tensión arterial ligeramente elevada. Se informa al médico.', 'high', ?, 1),
        (3, 'mobility', 'Mejora en movilidad', 'La residente muestra mejora en su capacidad de deambulación.', 'normal', ?, 1)
    `, [now, yesterday, twoDaysAgo]);

    console.log("✓ Nursing notes inserted");

    // Insert sample assessment scales
    const barthelData = JSON.stringify({
      feeding: 10,
      bathing: 5,
      grooming: 5,
      dressing: 10,
      bowels: 10,
      bladder: 10,
      toiletUse: 10,
      transfers: 15,
      mobility: 15,
      stairs: 10
    });

    await connection.execute(`
      INSERT INTO assessmentScales (residentId, scaleType, totalScore, assessmentDate, assessmentData, interpretation, assessedBy)
      VALUES 
        (1, 'barthel', 100, ?, ?, 'Independencia total', 1),
        (2, 'barthel', 85, ?, ?, 'Dependencia leve', 1)
    `, [now, barthelData, yesterday, barthelData]);

    console.log("✓ Assessment scales inserted");

    await connection.end();

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();

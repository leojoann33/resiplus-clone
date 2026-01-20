import "dotenv/config";
import { 
  createResident, 
  createVitalSign, 
  createMedication, 
  createNursingNote, 
  createRoom,
  getDb,
  updateResident
} from "../server/db";
import { 
  residents, 
  vitalSigns, 
  medications, 
  nursingNotes, 
  rooms,
  careTasks,
  scheduledTasks,
  careTypes
} from "../drizzle/schema";
import { eq, sql } from "drizzle-orm";

// --- Data Constants ---

const MALE_NAMES = [
  "Antonio", "José", "Manuel", "Francisco", "David", "Juan", "José Antonio", "Javier", "José Luis", "Daniel", 
  "Francisco Javier", "Jesús", "Carlos", "Alejandro", "Miguel", "José Manuel", "Rafael", "Pedro", "Ángel", "Miguel Ángel",
  "Luis", "Fernando", "Alberto", "Ramón", "Enrique"
];

const FEMALE_NAMES = [
  "María", "Carmen", "Ana María", "María Pilar", "Laura", "Josefa", "Isabel", "María Dolores", "María Teresa", "Ana",
  "Marta", "Cristina", "María Ángeles", "Lucía", "María Isabel", "Francisca", "Elena", "Antonia", "Dolores", "Consuelo",
  "Rosa", "Concepción", "Mercedes", "Teresa", "Beatriz"
];

const SURNAMES = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín",
  "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez",
  "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos", "Gil", "Ramírez", "Serrano", "Blanco", "Molina",
  "Morales", "Suarez", "Ortega", "Delgado", "Castro"
];

const TOWNS_GUADALAJARA = [
  "Guadalajara", "Azuqueca de Henares", "Sigüenza", "Molina de Aragón", "Cabanillas del Campo", "Marchamalo", 
  "Villanueva de la Torre", "El Casar", "Brihuega", "Alovera", "Mondéjar", "Pastrana", "Cifuentes", "Jadraque", 
  "Sacedón", "Yunquera de Henares", "Horche", "Humanes"
];

const STREETS = [
  "Calle Mayor", "Plaza de España", "Av. de la Constitución", "Calle Real", "Gran Vía", "Calle de la Iglesia",
  "Calle del Carmen", "Calle Nueva", "Paseo de la Estación", "Calle del Sol"
];

// --- Pathologies & Profiles ---

type Pathology = {
  name: string;
  medications: { name: string; activeIngredient: string; dosage: string; freq: string; route: "oral" | "subcutaneous" | "intravenous" | "intramuscular" | "topical" | "inhalation" | "transdermal" }[];
  vitalTendency: (base: any) => any;
  notes: string[];
};

const PATHOLOGIES: Record<string, Pathology> = {
  HYPERTENSION: {
    name: "Hipertensión Arterial",
    medications: [
      { name: "Enalapril", activeIngredient: "Enalapril Maleato", dosage: "20 mg", freq: "1-0-1", route: "oral" },
      { name: "Amlodipino", activeIngredient: "Amlodipino Besilato", dosage: "5 mg", freq: "1-0-0", route: "oral" }
    ],
    vitalTendency: (base) => ({ ...base, systolicBP: base.systolicBP + 20, diastolicBP: base.diastolicBP + 10 }),
    notes: ["Cifras tensionales elevadas por la mañana", "Refiere cefalea leve", "Buen control tensional con medicación", "Se recomienda dieta hiposódica"]
  },
  DIABETES: {
    name: "Diabetes Mellitus Tipo 2",
    medications: [
      { name: "Metformina", activeIngredient: "Metformina Clorhidrato", dosage: "850 mg", freq: "1-0-1", route: "oral" },
      { name: "Insulina Lantus", activeIngredient: "Insulina Glargina", dosage: "14 UI", freq: "0-0-1", route: "subcutaneous" },
      { name: "Insulina Rápida", activeIngredient: "Insulina Aspart", dosage: "Según pauta", freq: "1-1-1", route: "subcutaneous" }
    ],
    vitalTendency: (base) => ({ ...base, glucose: base.glucose + 40 }),
    notes: ["Glucemia capilar preprandial elevada", "Realizo cura de pie diabético (preventiva)", "Dieta diabética bien tolerada", "Recomendamos hidratación de miembros inferiores"]
  },
  COPD: {
    name: "EPOC",
    medications: [
      { name: "Ventolin", activeIngredient: "Salbutamol", dosage: "2 puffs", freq: "Si precisa", route: "inhalation" },
      { name: "Spiriva", activeIngredient: "Tiotropio", dosage: "1 cápsula", freq: "0-1-0", route: "inhalation" },
      { name: "Pulmicort", activeIngredient: "Budesonida", dosage: "400 mcg", freq: "1-0-1", route: "inhalation" }
    ],
    vitalTendency: (base) => ({ ...base, oxygenSaturation: base.oxygenSaturation - 4, respiratoryRate: base.respiratoryRate + 3 }),
    notes: ["Disnea de moderados esfuerzos", "Tos productiva matutina", "Saturación baja, se coloca gafas nasales a 2L", "Auscultación: roncus dispersos"]
  },
  ALZHEIMER: {
    name: "Alzheimer GDS 4",
    medications: [
      { name: "Aricept", activeIngredient: "Donepezilo", dosage: "10 mg", freq: "0-0-1", route: "oral" },
      { name: "Ebixa", activeIngredient: "Memantina", dosage: "20 mg", freq: "1-0-0", route: "oral" },
      { name: "Seroquel", activeIngredient: "Quetiapina", dosage: "25 mg", freq: "0-0-1", route: "oral" }
    ],
    vitalTendency: (base) => base,
    notes: ["Desorientado en tiempo y espacio", "Agitación vespertina (sundowning)", "Participa en taller de memoria", "Necesita ayuda parcial para ABVD", "Intento de fuga, se redirige"]
  },
  PARKINSON: {
    name: "Parkinson",
    medications: [
      { name: "Sinemet", activeIngredient: "Levodopa/Carbidopa", dosage: "250/25 mg", freq: "1-1-1", route: "oral" },
      { name: "Requip", activeIngredient: "Ropinirol", dosage: "2 mg", freq: "1-0-1", route: "oral" }
    ],
    vitalTendency: (base) => base,
    notes: ["Rigidez matutina leve", "Temblor de reposo en MSD", "Marcha festinante observada durante el paseo", "Dificultad para iniciar la deambulación", "Episodio de bloqueo (freezing)"]
  },
  HEART_FAILURE: {
    name: "Insuficiencia Cardíaca",
    medications: [
      { name: "Seguril", activeIngredient: "Furosemida", dosage: "40 mg", freq: "1-0-0", route: "oral" },
      { name: "Emconcor", activeIngredient: "Bisoprolol", dosage: "2.5 mg", freq: "1-0-0", route: "oral" },
      { name: "Aldactone", activeIngredient: "Espironolactona", dosage: "25 mg", freq: "1-0-0", route: "oral" }
    ],
    vitalTendency: (base) => ({ ...base, weight: base.weight + 1, heartRate: base.heartRate - 10 }),
    notes: ["Edemas maleolares leves +", "Disnea paroxística nocturna negada", "Peso estable", "Vigilar ingesta de líquidos", "Fatiga con pequeños esfuerzos"]
  },
  ARTHRITIS: {
    name: "Artrosis Severa",
    medications: [
      { name: "Termalgin", activeIngredient: "Paracetamol", dosage: "1g", freq: "1-1-1", route: "oral" },
      { name: "Nolotil", activeIngredient: "Metamizol", dosage: "575 mg", freq: "Si dolor", route: "oral" },
      { name: "Condrosan", activeIngredient: "Condroitín Sulfato", dosage: "800 mg", freq: "1-0-0", route: "oral" }
    ],
    vitalTendency: (base) => base,
    notes: ["Dolor en rodilla derecha al deambular", "Aplica calor local", "Camina con andador por inestabilidad", "Se administra analgésico de rescate"]
  },
  DEPRESSION: {
    name: "Depresión Mayor",
    medications: [
      { name: "Cipralex", activeIngredient: "Escitalopram", dosage: "10 mg", freq: "1-0-0", route: "oral" },
      { name: "Orfidal", activeIngredient: "Lorazepam", dosage: "1 mg", freq: "0-0-1", route: "oral" }
    ],
    vitalTendency: (base) => base,
    notes: ["Ánimo bajo, refiere soledad", "Participa poco en actividades grupales", "Apetito disminuido", "Duerme bien"]
  },
  STROKE: {
    name: "Ictus Isquémico Antiguo",
    medications: [
      { name: "Adiro", activeIngredient: "Ácido Acetilsalicílico", dosage: "100 mg", freq: "0-1-0", route: "oral" },
      { name: "Zarator", activeIngredient: "Atorvastatina", dosage: "40 mg", freq: "0-0-1", route: "oral" }
    ],
    vitalTendency: (base) => base,
    notes: ["Hemiparesia derecha residual", "Camina con bastón", "Dificultad leve para deglutir líquidos", "Buen estado cognitivo"]
  },
  OSTEOPOROSIS: {
    name: "Osteoporosis",
    medications: [
      { name: "Fosamax", activeIngredient: "Ácido Alendrónico", dosage: "70 mg", freq: "Semanal (Lun)", route: "oral" },
      { name: "Natecal D", activeIngredient: "Calcio + Vitamina D", dosage: "600mg/1000UI", freq: "1-0-0", route: "oral" }
    ],
    vitalTendency: (base) => base,
    notes: ["Precaución con caídas", "Usa protector de cadera", "Toma medicación semanal correctamente"]
  }
};

// --- Helpers ---

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 1) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate valid NIE/NIF
function generateNIF() {
  return `${randomInt(10000000, 99999999)}${pickRandom(["A","B","C","D","E","F","G","H","J","K","L","M"])}`;
}

// Generate Spanish phone
function generateMobilePhone() {
  return `6${randomInt(0,9)}${randomInt(0,9)} ${randomInt(10,99)} ${randomInt(10,99)} ${randomInt(10,99)}`;
}

function generateLandline(areaCode: number = 949) {
  return `${areaCode} ${randomInt(10,99)} ${randomInt(10,99)} ${randomInt(10,99)}`;
}

function generateEmail(first: string, last: string) {
  const domains = ["hotmail.com", "gmail.com", "yahoo.es", "outlook.com"];
  const cleanFirst = first.toLowerCase().replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u").replace(/ñ/g, "n");
  const cleanLast = last.split(" ")[0].toLowerCase().replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u").replace(/ñ/g, "n");
  return `${cleanFirst}.${cleanLast}${randomInt(1,99)}@${pickRandom(domains)}`;
}

// --- Main Seed Function ---

async function seed() {
  console.log("🌱 Starting ULTRA-REALISTIC master seed...");
  const db = await getDb();
  if (!db) {
    console.error("❌ Stats DB connection failed.");
    process.exit(1);
  }

  // 1. CLEANUP
  console.log("🧹 Clearing Database tables...");
  await db.delete(scheduledTasks);
  await db.delete(careTasks);
  await db.delete(nursingNotes);
  await db.delete(medications);
  await db.delete(vitalSigns);
  await db.delete(residents);
  await db.delete(rooms);

  // 2. CREATE INFRASTRUCTURE (Rooms)
  // Emera Guadalajara style: 70 rooms, ~136 beds
  console.log("🏨 Building Facility (Emera Guadalajara)...");
  const floors = [
    { level: 1, count: 20, start: 101 },
    { level: 2, count: 25, start: 201 },
    { level: 3, count: 25, start: 301 },
  ];
  
  const createdRoomIds: {id: number, beds: number}[] = [];

  for (const floor of floors) {
    for (let i = 0; i < floor.count; i++) {
      const roomNum = floor.start + i;
      const isSingle = Math.random() < 0.2; 
      const type = isSingle ? "single" : "double";
      const beds = isSingle ? 1 : 2;

      // We need the ID, so we insert and then fetch or use returned ID if driver supported
      // Drizzle with MySQL usually returns insertId in array
      const res = await db.insert(rooms).values({
        code: `${roomNum}`,
        name: `Habitación ${roomNum}`,
        roomType: type,
        floor: floor.level,
        wing: floor.level === 1 ? "Ala Norte" : "General",
        totalBeds: beds,
        availableBeds: beds,
        hasPrivateBathroom: true,
        isAccessible: true,
      });
      // @ts-ignore
      const newId = res[0].insertId;
      createdRoomIds.push({ id: newId, beds });
    }
  }
  console.log(`✅ Infrastructure built: ${createdRoomIds.length} rooms.`);

  // 3. CREATE RESIDENTS
  const profiles = [
    { gender: "female", pathologies: ["ALZHEIMER", "HYPERTENSION"], age: [80, 95] },
    { gender: "male", pathologies: ["COPD", "HYPERTENSION", "HEART_FAILURE"], age: [70, 85] },
    { gender: "female", pathologies: ["DIABETES", "ARTHRITIS"], age: [75, 90] },
    { gender: "male", pathologies: ["PARKINSON"], age: [70, 85] },
    { gender: "female", pathologies: ["HEART_FAILURE", "DIABETES", "OSTEOPOROSIS"], age: [80, 90] },
    { gender: "female", pathologies: ["ALZHEIMER", "DEPRESSION"], age: [85, 98] },
    { gender: "male", pathologies: ["STROKE", "HYPERTENSION"], age: [65, 80] }, 
    { gender: "female", pathologies: ["ARTHRITIS", "OSTEOPOROSIS", "HYPERTENSION"], age: [80, 95] },
    { gender: "male", pathologies: ["DIABETES", "HYPERTENSION", "COPD"], age: [75, 85] },
    { gender: "female", pathologies: ["ALZHEIMER", "INCONTINENCE", "DEPRESSION"], age: [85, 95] }, 
    { gender: "male", pathologies: ["HEART_FAILURE", "STROKE"], age: [70, 85] },
    { gender: "female", pathologies: ["DEPRESSION", "ARTHRITIS"], age: [75, 85] },
    { gender: "male", pathologies: ["ALZHEIMER", "PARKINSON"], age: [90, 100] },
    { gender: "female", pathologies: ["HYPERTENSION", "DIABETES", "ARTHRITIS"], age: [80, 90] },
  ];

  let roomCursor = 0;

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    const isFemale = profile.gender === "female";
    const firstName = pickRandom(isFemale ? FEMALE_NAMES : MALE_NAMES);
    const lastName = `${pickRandom(SURNAMES)} ${pickRandom(SURNAMES)}`;
    const birthYear = 2024 - randomInt(profile.age[0], profile.age[1]);
    const birthDate = randomDate(new Date(birthYear, 0, 1), new Date(birthYear, 11, 31));
    const admissionDate = randomDate(new Date(2019, 0, 1), new Date(2023, 11, 31));
    const originTown = pickRandom(TOWNS_GUADALAJARA);
    const address = `${pickRandom(STREETS)}, ${randomInt(1,150)}, ${originTown}`;
    
    // Assign Room
    const room = createdRoomIds[roomCursor];
    const bedNum = 1; // Simplify to bed 1 first
    // If double, next person goes here too? Let's just distribute linearly for now
    if (room.beds > 1 && Math.random() > 0.5) {
        // stay in this room for next person maybe?
        // simple distribution: Next room
    }
    roomCursor = (roomCursor + 1) % createdRoomIds.length;

    // Contact
    const contactPhone = generateMobilePhone();
    const contactEmail = generateEmail(firstName, lastName);
    const emerRelation = pickRandom(["Hijo/a", "Sobrino/a", "Hermano/a", "Yerno/Nuera"]);
    const emerSurname = emerRelation.includes("Hijo") ? lastName.split(" ")[0] : pickRandom(SURNAMES);
    const emerName = `${pickRandom(isFemale ? MALE_NAMES : FEMALE_NAMES)} ${emerSurname}`; // Opposite gender name for fun or random

    const residentId = await db.insert(residents).values({
      firstName,
      lastName,
      code: `RES-${2024001 + i}`,
      status: "active",
      birthDate: birthDate,
      admissionDate: admissionDate,
      gender: isFemale ? "female" : "male",
      birthPlace: originTown,
      nif: generateNIF(),
      nss: `NA${randomInt(1000000000, 9999999999)}`,
      nsip: `SIP-${randomInt(100000, 999999)}`,
      roomId: room.id,
      bedNumber: bedNum,
      createdBy: 1,
      notes: `Residente procedente de ${originTown}. Domicilio anterior: ${address}.`,
      allergies: Math.random() > 0.8 ? "Penicilina" : "No conocidas",
      specialNeeds: Math.random() > 0.7 ? "Requiere dieta triturada" : "Dieta basal",
      contactPhone,
      contactEmail,
      emergencyContactName: emerName,
      emergencyContactPhone: generateMobilePhone(),
      emergencyContactRelation: emerRelation,
      medicalNotes: `Antecedentes: ${profile.pathologies.map(p => PATHOLOGIES[p]?.name || p).join(", ")}.`
    }).then(res => Number(res[0].insertId));

    // Update room availability
    await db.update(rooms)
        .set({ availableBeds: sql`availableBeds - 1` })
        .where(eq(rooms.id, room.id));

    console.log(`Created: ${firstName} ${lastName}`);

    // 4. GENERATE HISTORY (Meds, Vitals, Notes)
    const activePathologies = profile.pathologies.map(p => PATHOLOGIES[p] || PATHOLOGIES.HYPERTENSION);

    // Medications
    for (const pathology of activePathologies) {
      for (const med of pathology.medications) {
        await createMedication({
          residentId: residentId,
          medicationName: med.name,
          activeIngredient: med.activeIngredient,
          dosage: med.dosage,
          unit: "ud",
          frequency: med.freq,
          administrationRoute: med.route,
          scheduleType: "chronic",
          startDate: admissionDate,
          isActive: true,
          indication: pathology.name,
          administrationTimes: JSON.stringify(["09:00", "21:00"]),
          createdBy: 1,
          prescribedBy: "Dr. Moreno"
        });
      }
    }

    // Vitals History
    const today = new Date();
    today.setHours(8,0,0,0);
    
    // Generate ~150 data points over last year
    let currentDate = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000));
    
    while (currentDate <= today) {
        currentDate = new Date(currentDate.getTime() + (randomInt(2, 5) * 24 * 60 * 60 * 1000));
        
        let vitals: any = {
            systolicBP: randomInt(110, 130),
            diastolicBP: randomInt(65, 85),
            heartRate: randomInt(60, 85),
            respiratoryRate: randomInt(12, 18),
            oxygenSaturation: randomFloat(94, 99),
            temperature: randomFloat(36.0, 36.7),
            glucose: randomInt(80, 115),
            weight: randomFloat(50, 85)
        };

        // Patho modifiers
        activePathologies.forEach(p => vitals = p.vitalTendency(vitals));

        // Noise
        vitals.systolicBP += randomInt(-8, 8);
        
        // Save (Batch usually but loop is fine for 14 people)
        if (Math.random() > 0.4) {
             await createVitalSign({
                residentId: residentId,
                measurementType: "blood_pressure",
                systolicBP: vitals.systolicBP,
                diastolicBP: vitals.diastolicBP,
                heartRate: vitals.heartRate,
                measurementDate: currentDate,
                recordedBy: 1
            });
        }
    }

    // 5. TODAY'S TASKS (For dashboard)
    if (Math.random() > 0.1) { // 90% have tasks
        const controlCount = randomInt(2, 4);
        for(let k=0; k<controlCount; k++) {
             // Fake task
             await db.insert(scheduledTasks).values({
                residentId: residentId,
                careTypeId: 1, // Assumes ID 1 exists (Control TA usually)
                scheduledDateTime: new Date(),
                status: Math.random() > 0.5 ? "completed" : "pending",
                executedByUserId: 1,
                resultValue: "120/70",
                createdAt: new Date(),
                updatedAt: new Date()
             });
        }
    }
  }

  console.log("✨ Master Seed Complete!");
  process.exit(0);
}

seed().catch(console.error);

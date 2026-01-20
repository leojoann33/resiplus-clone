import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

async function seedPetrescuResidents() {
  console.log("🌱 Creando 4 residentes de la Residencia Geriátrica Petrescu...\n");

  const connection = await mysql.createConnection(DATABASE_URL);
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    // =========================================
    // RESIDENTE 1: Pilar Moreno Castillo (Mujer independiente con Sintrom y HTA)
    // =========================================
    console.log("👵 Creando: Pilar Moreno Castillo (Independiente, Sintrom, HTA)...");
    
    const [pilarResult] = await connection.execute(`
      INSERT INTO residents (
        code, nif, nss, nsip, firstName, lastName, birthDate, gender, 
        admissionDate, lastAdmissionDate, birthPlace, roomId, bedNumber, status,
        contactPhone, contactEmail, emergencyContactName, emergencyContactPhone, 
        emergencyContactRelation, notes, medicalNotes, allergies, specialNeeds, createdBy
      ) VALUES (
        'P001', '45678123M', '281945678901', 'SPES45678123M01', 'Pilar', 'Moreno Castillo',
        '1939-03-15', 'female', '2022-06-01', '2022-06-01', 'Guadalajara, Castilla-La Mancha',
        1, 1, 'active', '949123456', 'pilar.moreno@email.es',
        'Fernando Moreno García', '649123456', 'Hijo',
        'Residente muy colaboradora. Le gusta participar en las actividades de la residencia. Disfruta de la lectura y las manualidades. Es muy sociable con otros residentes.',
        'Paciente en tratamiento anticoagulante con Sintrom por fibrilación auricular no valvular diagnosticada en 2015. Hipertensión arterial controlada con medicación. Controles INR semanales. Último INR: 2.4 (rango terapéutico: 2.0-3.0). Autonomía funcional conservada. No deterioro cognitivo.',
        'Alérgica a la Penicilina y derivados (reacción cutánea tipo urticaria documentada en 2001)',
        'Control semanal de INR. Evitar alimentos ricos en vitamina K en exceso (espinacas, brócoli). Vigilar signos de sangrado.',
        1
      )
    `);
    const pilarId = pilarResult.insertId;
    console.log("  ✓ Datos básicos insertados (ID: " + pilarId + ")");

    // Medicamentos de Pilar
    await connection.execute(`
      INSERT INTO medications (residentId, medicationName, activeIngredient, dosage, unit, administrationRoute, frequency, scheduleType, startDate, monday, tuesday, wednesday, thursday, friday, saturday, sunday, administrationTimes, indication, prescribedBy, notes, createdBy)
      VALUES 
        (?, 'Sintrom 4mg', 'Acenocumarol', 'Según INR', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2015-09-10', 1, 1, 1, 1, 1, 1, 1, '["20:00"]', 'Fibrilación auricular no valvular - Anticoagulación', 'Dr. Antonio Ruiz - Cardiología', 'Dosis según pauta de hematología. Último INR: 2.4. Ajuste semanal.', 1),
        (?, 'Enalapril 20mg', 'Enalapril maleato', '20', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2018-03-15', 1, 1, 1, 1, 1, 1, 1, '["08:00"]', 'Hipertensión arterial esencial', 'Dra. María González - Medicina Interna', 'Buen control tensional. TA objetivo: <140/90 mmHg', 1),
        (?, 'Omeprazol 20mg', 'Omeprazol', '20', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2015-09-10', 1, 1, 1, 1, 1, 1, 1, '["08:00"]', 'Protección gástrica por anticoagulación', 'Dra. María González - Medicina Interna', 'Tomar en ayunas, 30 min antes del desayuno', 1),
        (?, 'Atorvastatina 20mg', 'Atorvastatina cálcica', '20', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2017-05-20', 1, 1, 1, 1, 1, 1, 1, '["22:00"]', 'Dislipemia mixta', 'Dra. María González - Medicina Interna', 'Último perfil lipídico: Colesterol total 185, LDL 95, HDL 52, TG 145', 1)
    `, [pilarId, pilarId, pilarId, pilarId]);
    console.log("  ✓ 4 medicamentos insertados");

    // Constantes vitales de Pilar
    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, systolicBP, diastolicBP, heartRate, measurementDate, notes, recordedBy)
      VALUES 
        (?, 'blood_pressure', 138, 82, 78, ?, 'TA bien controlada. FC irregular (FA conocida).', 1),
        (?, 'blood_pressure', 142, 85, 74, ?, 'Ligeramente elevada, sin síntomas.', 1)
    `, [pilarId, now, pilarId, yesterday]);
    
    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, temperature, measurementDate, notes, recordedBy)
      VALUES (?, 'temperature', 36.4, ?, 'Afebril', 1)
    `, [pilarId, now]);
    console.log("  ✓ Constantes vitales insertadas");

    // Escala Barthel de Pilar (Independiente: 100 puntos)
    const pilarBarthel = JSON.stringify({
      feeding: 10, // Independiente
      bathing: 5,  // Independiente
      grooming: 5, // Independiente
      dressing: 10, // Independiente
      bowels: 10, // Continente
      bladder: 10, // Continente
      toiletUse: 10, // Independiente
      transfers: 15, // Independiente
      mobility: 15, // Independiente
      stairs: 10 // Independiente
    });
    await connection.execute(`
      INSERT INTO assessmentScales (residentId, scaleType, totalScore, assessmentDate, assessmentData, interpretation, notes, assessedBy)
      VALUES (?, 'barthel', 100, ?, ?, 'Independencia total', 'Residente autónoma para todas las ABVD. Muy colaboradora.', 1)
    `, [pilarId, now, pilarBarthel]);
    console.log("  ✓ Escala Barthel insertada (100 pts - Independiente)");

    // Notas de enfermería de Pilar
    await connection.execute(`
      INSERT INTO nursingNotes (residentId, category, title, content, priority, noteDate, createdBy)
      VALUES 
        (?, 'general', 'Valoración semanal', 'Residente estable, sin incidencias. Mantiene autonomía funcional. Participa activamente en actividades de terapia ocupacional. Estado anímico positivo.', 'normal', ?, 1),
        (?, 'medication', 'Control INR semanal', 'Extracción realizada para control de INR. Se envía muestra a laboratorio. Pendiente resultado para ajuste de pauta de Sintrom.', 'high', ?, 1)
    `, [pilarId, now, pilarId, yesterday]);
    console.log("  ✓ Notas de enfermería insertadas\n");

    // =========================================
    // RESIDENTE 2: Dolores Fernández Ruiz (Mujer con Alzheimer, dependiente)
    // =========================================
    console.log("👵 Creando: Dolores Fernández Ruiz (Alzheimer, Dependiente, ITU recurrente)...");
    
    const [doloresResult] = await connection.execute(`
      INSERT INTO residents (
        code, nif, nss, nsip, firstName, lastName, birthDate, gender, 
        admissionDate, lastAdmissionDate, birthPlace, roomId, bedNumber, status,
        contactPhone, contactEmail, emergencyContactName, emergencyContactPhone, 
        emergencyContactRelation, notes, medicalNotes, allergies, specialNeeds, createdBy
      ) VALUES (
        'P002', '23456789L', '281938234567', 'SPES23456789L02', 'Dolores', 'Fernández Ruiz',
        '1938-11-22', 'female', '2021-02-14', '2021-02-14', 'Guadalajara, Castilla-La Mancha',
        2, 1, 'active', '949234567', NULL,
        'Carmen Sánchez Fernández', '678234567', 'Hija',
        'Residente con demencia tipo Alzheimer estadio moderado-severo (GDS 5-6). Requiere supervisión y ayuda para todas las ABVD. Tendencia a la deambulación errante. Responde bien a estímulos musicales de su época. Intolerancia a la lactosa.',
        'Enfermedad de Alzheimer diagnosticada en 2018. Intolerancia a lactosa. ITUs de repetición (3-4 episodios/año). Última ITU hace 2 meses tratada con Fosfomicina. Portadora de pañal. Prótesis dental completa. Hipotiroidismo subclínico.',
        'INTOLERANCIA A LA LACTOSA (gastroenteritis severa). Sin alergias medicamentosas conocidas.',
        'Dieta SIN LACTOSA. Supervisión continua por riesgo de caídas y deambulación errante. Fomentar ingesta hídrica abundante (>1.5L/día) para prevención de ITU. Estimulación cognitiva diaria. Musicoterapia.',
        1
      )
    `);
    const doloresId = doloresResult.insertId;
    console.log("  ✓ Datos básicos insertados (ID: " + doloresId + ")");

    // Medicamentos de Dolores
    await connection.execute(`
      INSERT INTO medications (residentId, medicationName, activeIngredient, dosage, unit, administrationRoute, frequency, scheduleType, startDate, monday, tuesday, wednesday, thursday, friday, saturday, sunday, administrationTimes, indication, prescribedBy, notes, createdBy)
      VALUES 
        (?, 'Donepezilo 10mg', 'Donepezilo clorhidrato', '10', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2018-06-01', 1, 1, 1, 1, 1, 1, 1, '["22:00"]', 'Enfermedad de Alzheimer - Inhibidor colinesterasa', 'Dr. Carlos Martín - Neurología', 'Tomar por la noche para minimizar efectos GI', 1),
        (?, 'Memantina 20mg', 'Memantina clorhidrato', '20', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2020-03-15', 1, 1, 1, 1, 1, 1, 1, '["08:00"]', 'Enfermedad de Alzheimer moderada-severa', 'Dr. Carlos Martín - Neurología', 'Antagonista NMDA. Titulación completada.', 1),
        (?, 'Eutirox 50mcg', 'Levotiroxina sódica', '50', 'mcg', 'oral', 'Cada 24 horas', 'chronic', '2019-11-20', 1, 1, 1, 1, 1, 1, 1, '["07:30"]', 'Hipotiroidismo subclínico', 'Dra. María González - Medicina Interna', 'Tomar en ayunas, 30-60 min antes del desayuno', 1),
        (?, 'Arándano Rojo 120mg', 'Extracto de Vaccinium macrocarpon', '120', 'mg', 'oral', 'Cada 12 horas', 'chronic', '2023-01-10', 1, 1, 1, 1, 1, 1, 1, '["08:00","20:00"]', 'Prevención ITUs recurrentes', 'Dra. María González - Medicina Interna', 'Suplemento profiláctico', 1),
        (?, 'Quetiapina 25mg', 'Quetiapina fumarato', '25', 'mg', 'oral', 'Según necesidad', 'chronic', '2022-08-01', 1, 1, 1, 1, 1, 1, 1, '["22:00"]', 'Agitación nocturna asociada a demencia', 'Dr. Carlos Martín - Neurología', 'Usar solo si presenta agitación vespertina/nocturna. Dosis mínima eficaz.', 1)
    `, [doloresId, doloresId, doloresId, doloresId, doloresId]);
    console.log("  ✓ 5 medicamentos insertados");

    // Constantes vitales de Dolores
    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, systolicBP, diastolicBP, heartRate, measurementDate, notes, recordedBy)
      VALUES 
        (?, 'blood_pressure', 128, 76, 72, ?, 'TA normal. Sin alteraciones.', 1),
        (?, 'blood_pressure', 125, 78, 70, ?, 'Estable.', 1)
    `, [doloresId, now, doloresId, yesterday]);

    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, temperature, measurementDate, notes, recordedBy)
      VALUES (?, 'temperature', 36.8, ?, 'Afebril. Vigilar por antecedentes de ITU.', 1)
    `, [doloresId, now]);
    console.log("  ✓ Constantes vitales insertadas");

    // Escala Barthel de Dolores (Dependencia severa: 25 puntos)
    const doloresBarthel = JSON.stringify({
      feeding: 5,   // Necesita ayuda
      bathing: 0,   // Dependiente
      grooming: 0,  // Dependiente
      dressing: 5,  // Necesita ayuda
      bowels: 5,    // Incontinencia ocasional
      bladder: 0,   // Incontinente (pañal)
      toiletUse: 5, // Necesita ayuda
      transfers: 5, // Gran ayuda
      mobility: 0,  // Requiere supervisión continua
      stairs: 0     // Incapaz
    });
    await connection.execute(`
      INSERT INTO assessmentScales (residentId, scaleType, totalScore, assessmentDate, assessmentData, interpretation, notes, assessedBy)
      VALUES (?, 'barthel', 25, ?, ?, 'Dependencia severa', 'Requiere ayuda para todas las ABVD. Deterioro cognitivo moderado-severo por Alzheimer. Portadora de pañal.', 1)
    `, [doloresId, now, doloresBarthel]);
    console.log("  ✓ Escala Barthel insertada (25 pts - Dependiente severa)");

    // Escala Norton de Dolores (Riesgo moderado de UPP)
    const doloresNorton = JSON.stringify({
      physicalCondition: 3,  // Regular
      mentalCondition: 2,    // Apático/Confuso
      activity: 2,           // Camina con ayuda
      mobility: 3,           // Ligeramente limitada
      incontinence: 1        // Incontinencia urinaria y fecal
    });
    await connection.execute(`
      INSERT INTO assessmentScales (residentId, scaleType, totalScore, assessmentDate, assessmentData, interpretation, notes, assessedBy)
      VALUES (?, 'norton', 11, ?, ?, 'Riesgo medio de UPP', 'Vigilar zonas de presión. Cambios posturales c/3h. Hidratación cutánea.', 1)
    `, [doloresId, now, doloresNorton]);
    console.log("  ✓ Escala Norton insertada (11 pts - Riesgo medio UPP)");

    // Notas de enfermería de Dolores
    await connection.execute(`
      INSERT INTO nursingNotes (residentId, category, title, content, priority, noteDate, createdBy)
      VALUES 
        (?, 'behavior', 'Deambulación errante', 'Durante la tarde, la residente presenta episodio de deambulación errante por el pasillo. Se redirige a zona común. Se ofrece actividad de musicoterapia con buena respuesta. Se calma con canciones de su época.', 'normal', ?, 1),
        (?, 'hygiene', 'Cambio de pañal', 'Se realizan cambios de pañal según protocolo (c/3h y cuando precisa). Piel íntegra. Se aplica crema barrera en zona perianal.', 'normal', ?, 1),
        (?, 'nutrition', 'Ingesta diaria', 'Acepta bien la dieta triturada SIN LACTOSA. Ingesta hídrica: aproximadamente 1.3L. Se fomenta beber más líquidos.', 'normal', ?, 1)
    `, [doloresId, now, doloresId, yesterday, doloresId, twoDaysAgo]);
    console.log("  ✓ Notas de enfermería insertadas\n");

    // =========================================
    // RESIDENTE 3: Manuel García Hernández (Hombre con úlceras, diabético)
    // =========================================
    console.log("👴 Creando: Manuel García Hernández (Úlceras grado II, Diabético, Cambios posturales c/2h)...");
    
    const [manuelResult] = await connection.execute(`
      INSERT INTO residents (
        code, nif, nss, nsip, firstName, lastName, birthDate, gender, 
        admissionDate, lastAdmissionDate, birthPlace, roomId, bedNumber, status,
        contactPhone, contactEmail, emergencyContactName, emergencyContactPhone, 
        emergencyContactRelation, notes, medicalNotes, allergies, specialNeeds, createdBy
      ) VALUES (
        'P003', '78901234K', '281942789012', 'SPES78901234K03', 'Manuel', 'García Hernández',
        '1942-07-08', 'male', '2023-03-20', '2023-03-20', 'Guadalajara, Castilla-La Mancha',
        3, 1, 'active', '949345678', 'manuel.garcia@email.es',
        'José Manuel García López', '687345678', 'Hijo',
        'Residente con movilidad reducida. Permanece encamado o en sillón. Úlceras por presión en ambas caderas (trocánteres) grado II. Requiere cambios posturales estrictos cada 2 horas. Diabetes mellitus tipo 2 insulinodependiente.',
        'Diabetes Mellitus tipo 2 desde hace 25 años, actualmente insulinodependiente. HbA1c último: 7.2%. Úlceras por presión bilaterales en trocánteres, estadio II según clasificación NPUAP. Enfermedad renal crónica estadio 3a (FG 52 ml/min). Cardiopatía isquémica con IAM en 2019, actualmente estable.',
        'Alergia a Sulfamidas (exantema cutáneo). Contraindicadas quinolonas por prolongación QT.',
        'CAMBIOS POSTURALES CADA 2 HORAS (ESTRICTO). Control glucémico antes de cada comida y al acostarse. Curas de úlceras según protocolo cada 24-48h. Superficie especial de manejo de presión (SEMP). Dieta diabética 1800 kcal.',
        1
      )
    `);
    const manuelId = manuelResult.insertId;
    console.log("  ✓ Datos básicos insertados (ID: " + manuelId + ")");

    // Medicamentos de Manuel
    await connection.execute(`
      INSERT INTO medications (residentId, medicationName, activeIngredient, dosage, unit, administrationRoute, frequency, scheduleType, startDate, monday, tuesday, wednesday, thursday, friday, saturday, sunday, administrationTimes, indication, prescribedBy, notes, createdBy)
      VALUES 
        (?, 'Insulina Lantus', 'Insulina glargina', '22', 'UI', 'subcutaneous', 'Cada 24 horas', 'chronic', '2020-01-15', 1, 1, 1, 1, 1, 1, 1, '["22:00"]', 'Diabetes Mellitus tipo 2 - Insulina basal', 'Dr. Pedro Sánchez - Endocrinología', 'Administrar en abdomen o muslo. Rotar zona de inyección.', 1),
        (?, 'Insulina Novorapid', 'Insulina aspart', 'Según pauta', 'UI', 'subcutaneous', 'Antes de comidas', 'chronic', '2020-01-15', 1, 1, 1, 1, 1, 1, 1, '["08:00","13:00","20:00"]', 'Diabetes Mellitus tipo 2 - Insulina rápida', 'Dr. Pedro Sánchez - Endocrinología', 'Pauta: 6-8-6 UI. Ajustar según glucemia capilar.', 1),
        (?, 'Metformina 850mg', 'Metformina clorhidrato', '850', 'mg', 'oral', 'Cada 12 horas', 'chronic', '2015-06-01', 1, 1, 1, 1, 1, 1, 1, '["08:00","20:00"]', 'Diabetes Mellitus tipo 2 - Sensibilizador insulina', 'Dr. Pedro Sánchez - Endocrinología', 'Tomar con las comidas para minimizar efectos GI', 1),
        (?, 'Adiro 100mg', 'Ácido acetilsalicílico', '100', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2019-04-10', 1, 1, 1, 1, 1, 1, 1, '["14:00"]', 'Prevención secundaria cardiopatía isquémica', 'Dr. Antonio Ruiz - Cardiología', 'Tomar con la comida principal', 1),
        (?, 'Bisoprolol 5mg', 'Bisoprolol fumarato', '5', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2019-04-10', 1, 1, 1, 1, 1, 1, 1, '["08:00"]', 'Cardiopatía isquémica - Control FC', 'Dr. Antonio Ruiz - Cardiología', 'FC objetivo: 60-70 lpm', 1),
        (?, 'Ramipril 5mg', 'Ramipril', '5', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2019-04-10', 1, 1, 1, 1, 1, 1, 1, '["08:00"]', 'Cardiopatía isquémica + Nefroprotección', 'Dr. Antonio Ruiz - Cardiología', 'IECA. Control función renal periódico.', 1),
        (?, 'Paracetamol 1g', 'Paracetamol', '1000', 'mg', 'oral', 'Cada 8 horas si dolor', 'chronic', '2023-03-25', 1, 1, 1, 1, 1, 1, 1, '["08:00","16:00","00:00"]', 'Dolor asociado a úlceras por presión', 'Dra. María González - Medicina Interna', 'Administrar si EVA ≥ 4', 1)
    `, [manuelId, manuelId, manuelId, manuelId, manuelId, manuelId, manuelId]);
    console.log("  ✓ 7 medicamentos insertados");

    // Constantes vitales de Manuel
    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, systolicBP, diastolicBP, heartRate, measurementDate, notes, recordedBy)
      VALUES 
        (?, 'blood_pressure', 132, 78, 64, ?, 'TA controlada. FC bradicárdica por betabloqueante.', 1),
        (?, 'blood_pressure', 128, 76, 62, ?, 'Estable.', 1)
    `, [manuelId, now, manuelId, yesterday]);

    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, glucose, measurementDate, notes, recordedBy)
      VALUES 
        (?, 'glucose', 145, ?, 'Glucemia preprandial. Aceptable.', 1),
        (?, 'glucose', 168, ?, 'Glucemia postprandial 2h. Ligeramente elevada.', 1),
        (?, 'glucose', 132, ?, 'Glucemia en ayunas. Buen control.', 1)
    `, [manuelId, now, manuelId, now, manuelId, yesterday]);

    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, temperature, measurementDate, notes, recordedBy)
      VALUES (?, 'temperature', 36.6, ?, 'Afebril. Sin signos de infección en úlceras.', 1)
    `, [manuelId, now]);
    console.log("  ✓ Constantes vitales insertadas");

    // Escala Barthel de Manuel (Dependencia moderada: 45 puntos)
    const manuelBarthel = JSON.stringify({
      feeding: 10,  // Independiente
      bathing: 0,   // Dependiente
      grooming: 5,  // Independiente
      dressing: 5,  // Necesita ayuda
      bowels: 10,   // Continente
      bladder: 5,   // Incontinencia ocasional
      toiletUse: 5, // Necesita ayuda
      transfers: 5, // Gran ayuda (grúa)
      mobility: 0,  // Incapaz (encamado/sillón)
      stairs: 0     // Incapaz
    });
    await connection.execute(`
      INSERT INTO assessmentScales (residentId, scaleType, totalScore, assessmentDate, assessmentData, interpretation, notes, assessedBy)
      VALUES (?, 'barthel', 45, ?, ?, 'Dependencia moderada', 'Movilidad muy reducida. Permanece encamado/sillón. Úlceras por presión en ambos trocánteres.', 1)
    `, [manuelId, now, manuelBarthel]);
    console.log("  ✓ Escala Barthel insertada (45 pts - Dependencia moderada)");

    // Escala Norton de Manuel (Alto riesgo de UPP)
    const manuelNorton = JSON.stringify({
      physicalCondition: 2,  // Malo (úlceras activas)
      mentalCondition: 4,    // Alerta
      activity: 1,           // Encamado/sillón
      mobility: 1,           // Inmóvil
      incontinence: 2        // Ocasional
    });
    await connection.execute(`
      INSERT INTO assessmentScales (residentId, scaleType, totalScore, assessmentDate, assessmentData, interpretation, notes, assessedBy)
      VALUES (?, 'norton', 10, ?, ?, 'Alto riesgo de UPP', 'Ya presenta UPP bilaterales en trocánteres grado II. Cambios posturales estrictos c/2h. SEMP activa.', 1)
    `, [manuelId, now, manuelNorton]);
    console.log("  ✓ Escala Norton insertada (10 pts - Alto riesgo UPP)");

    // Notas de enfermería de Manuel
    await connection.execute(`
      INSERT INTO nursingNotes (residentId, category, title, content, priority, noteDate, createdBy)
      VALUES 
        (?, 'wound_care', 'Cura de úlceras trocantéreas', 'Se realiza cura de UPP bilaterales en trocánteres. Derecho: 3x2 cm, estadio II, lecho rosado, bordes epitelizando. Izquierdo: 2.5x2 cm, estadio II, buen aspecto. Se aplica apósito hidrocoloide en ambas. Próxima cura en 48h.', 'high', ?, 1),
        (?, 'mobility', 'Registro cambios posturales', 'Cambios posturales realizados según protocolo cada 2 horas: 08:00 DLD, 10:00 DS, 12:00 DLI, 14:00 sillón, 16:00 cama DLD, 18:00 DS, 20:00 DLI, 22:00 DS. Buena tolerancia.', 'high', ?, 1),
        (?, 'medication', 'Control glucémico', 'Glucemias del día: Ayunas 132 mg/dL, pre-almuerzo 145 mg/dL, post-almuerzo 168 mg/dL. Se administra insulina según pauta. Buen control general.', 'normal', ?, 1)
    `, [manuelId, now, manuelId, yesterday, manuelId, twoDaysAgo]);
    console.log("  ✓ Notas de enfermería insertadas\n");

    // =========================================
    // RESIDENTE 4: Francisco Jiménez Torres (Hombre con SNG, silla de ruedas, grúa)
    // =========================================
    console.log("👴 Creando: Francisco Jiménez Torres (SNG, Silla de ruedas, Pañales, Grúa)...");
    
    const [franciscoResult] = await connection.execute(`
      INSERT INTO residents (
        code, nif, nss, nsip, firstName, lastName, birthDate, gender, 
        admissionDate, lastAdmissionDate, birthPlace, roomId, bedNumber, status,
        contactPhone, contactEmail, emergencyContactName, emergencyContactPhone, 
        emergencyContactRelation, notes, medicalNotes, allergies, specialNeeds, createdBy
      ) VALUES (
        'P004', '56789012J', '281936567890', 'SPES56789012J04', 'Francisco', 'Jiménez Torres',
        '1936-12-03', 'male', '2022-09-15', '2022-09-15', 'Guadalajara, Castilla-La Mancha',
        4, 1, 'active', '949456789', NULL,
        'María Jiménez Martín', '656456789', 'Hija',
        'Residente con dependencia total. Portador de sonda nasogástrica para alimentación enteral. Desplazamiento en silla de ruedas. Movilización mediante grúa. Portador de pañal por incontinencia doble. Secuelas de ACV con hemiplejia izquierda y disfagia severa.',
        'ACV isquémico en ACM derecha (2021) con hemiplejia izquierda residual y disfagia severa. Portador de SNG desde marzo 2022 (cambio mensual). Fibrilación auricular permanente anticoagulada. HTA. Dislipemia. EPOC leve. Sin capacidad de deambulación. Comunicación verbal limitada, comprende órdenes sencillas.',
        'Sin alergias medicamentosas conocidas. Sin intolerancias alimentarias.',
        'ALIMENTACIÓN POR SONDA NASOGÁSTRICA (Nutrición enteral Nutrison 1.5 kcal/ml, 1500 ml/día repartidos en 5 tomas). Movilización con GRÚA. Silla de ruedas para traslados. PAÑAL por incontinencia urinaria y fecal. Cambios posturales c/3h. Cambio de SNG mensual (próximo: 15 febrero). Fisioterapia pasiva diaria.',
        1
      )
    `);
    const franciscoId = franciscoResult.insertId;
    console.log("  ✓ Datos básicos insertados (ID: " + franciscoId + ")");

    // Medicamentos de Francisco
    await connection.execute(`
      INSERT INTO medications (residentId, medicationName, activeIngredient, dosage, unit, administrationRoute, frequency, scheduleType, startDate, monday, tuesday, wednesday, thursday, friday, saturday, sunday, administrationTimes, indication, prescribedBy, notes, createdBy)
      VALUES 
        (?, 'Sintrom 4mg', 'Acenocumarol', 'Según INR', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2021-06-01', 1, 1, 1, 1, 1, 1, 1, '["20:00"]', 'Fibrilación auricular permanente', 'Dr. Antonio Ruiz - Cardiología', 'Administrar por SNG triturado. INR objetivo 2-3.', 1),
        (?, 'Omeprazol 20mg', 'Omeprazol', '20', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2022-03-15', 1, 1, 1, 1, 1, 1, 1, '["08:00"]', 'Protección gástrica por SNG', 'Dra. María González - Medicina Interna', 'Administrar por SNG. Disolver en agua.', 1),
        (?, 'Enalapril 10mg', 'Enalapril maleato', '10', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2018-05-10', 1, 1, 1, 1, 1, 1, 1, '["08:00"]', 'Hipertensión arterial', 'Dra. María González - Medicina Interna', 'Administrar por SNG', 1),
        (?, 'Atorvastatina 40mg', 'Atorvastatina cálcica', '40', 'mg', 'oral', 'Cada 24 horas', 'chronic', '2021-06-15', 1, 1, 1, 1, 1, 1, 1, '["22:00"]', 'Dislipemia - Prevención secundaria ictus', 'Dr. Carlos Martín - Neurología', 'Administrar por SNG', 1),
        (?, 'Seretide Diskus 50/500', 'Salmeterol/Fluticasona', '1', 'inh', 'inhalation', 'Cada 12 horas', 'chronic', '2019-02-20', 1, 1, 1, 1, 1, 1, 1, '["08:00","20:00"]', 'EPOC leve-moderado', 'Dr. Luis Fernández - Neumología', 'Enjuagar boca después de usar. Supervisar administración.', 1),
        (?, 'Duphalac 15ml', 'Lactulosa', '15', 'ml', 'oral', 'Cada 24 horas', 'chronic', '2022-03-20', 1, 1, 1, 1, 1, 1, 1, '["22:00"]', 'Estreñimiento asociado a inmovilidad y NE', 'Dra. María González - Medicina Interna', 'Administrar por SNG. Puede aumentar a 2 veces/día si precisa.', 1),
        (?, 'Nutrison Energy 1.5', 'Nutrición enteral completa', '300', 'ml', 'oral', 'Cada 4-5 horas', 'chronic', '2022-03-15', 1, 1, 1, 1, 1, 1, 1, '["08:00","12:00","16:00","20:00","00:00"]', 'Nutrición enteral por SNG (disfagia severa)', 'Dra. Andrea López - Nutrición', 'Total 1500 ml/día = 2250 kcal. Administrar a ritmo lento. Incorporar cabecero 30-45°.', 1)
    `, [franciscoId, franciscoId, franciscoId, franciscoId, franciscoId, franciscoId, franciscoId]);
    console.log("  ✓ 7 medicamentos insertados");

    // Constantes vitales de Francisco
    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, systolicBP, diastolicBP, heartRate, measurementDate, notes, recordedBy)
      VALUES 
        (?, 'blood_pressure', 136, 80, 82, ?, 'TA controlada. FC arrítmica (FA conocida).', 1),
        (?, 'blood_pressure', 140, 82, 78, ?, 'Ligeramente elevada, sin síntomas.', 1)
    `, [franciscoId, now, franciscoId, yesterday]);

    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, oxygenSaturation, measurementDate, notes, recordedBy)
      VALUES 
        (?, 'oxygen_saturation', 94, ?, 'SatO2 basal. EPOC conocido. Sin disnea.', 1),
        (?, 'oxygen_saturation', 93, ?, 'SatO2 aceptable.', 1)
    `, [franciscoId, now, franciscoId, yesterday]);

    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, temperature, measurementDate, notes, recordedBy)
      VALUES (?, 'temperature', 36.5, ?, 'Afebril.', 1)
    `, [franciscoId, now]);

    await connection.execute(`
      INSERT INTO vitalSigns (residentId, measurementType, weight, measurementDate, notes, recordedBy)
      VALUES (?, 'weight', 68.5, ?, 'Peso estable. Nutrición enteral adecuada.', 1)
    `, [franciscoId, weekAgo]);
    console.log("  ✓ Constantes vitales insertadas");

    // Escala Barthel de Francisco (Dependencia total: 0 puntos)
    const franciscoBarthel = JSON.stringify({
      feeding: 0,   // Dependiente (SNG)
      bathing: 0,   // Dependiente
      grooming: 0,  // Dependiente
      dressing: 0,  // Dependiente
      bowels: 0,    // Incontinente
      bladder: 0,   // Incontinente
      toiletUse: 0, // Dependiente
      transfers: 0, // Dependiente (grúa)
      mobility: 0,  // Incapaz
      stairs: 0     // Incapaz
    });
    await connection.execute(`
      INSERT INTO assessmentScales (residentId, scaleType, totalScore, assessmentDate, assessmentData, interpretation, notes, assessedBy)
      VALUES (?, 'barthel', 0, ?, ?, 'Dependencia total', 'Residente con dependencia total para todas las ABVD. Secuelas de ACV. Portador de SNG. Movilización con grúa. Incontinencia doble.', 1)
    `, [franciscoId, now, franciscoBarthel]);
    console.log("  ✓ Escala Barthel insertada (0 pts - Dependencia total)");

    // Escala Norton de Francisco (Muy alto riesgo de UPP)
    const franciscoNorton = JSON.stringify({
      physicalCondition: 2,  // Malo
      mentalCondition: 3,    // Confuso (comunicación limitada)
      activity: 1,           // Encamado/silla
      mobility: 1,           // Inmóvil
      incontinence: 1        // Incontinencia total
    });
    await connection.execute(`
      INSERT INTO assessmentScales (residentId, scaleType, totalScore, assessmentDate, assessmentData, interpretation, notes, assessedBy)
      VALUES (?, 'norton', 8, ?, ?, 'Muy alto riesgo de UPP', 'Riesgo muy alto. SEMP obligatoria. Cambios posturales c/3h. Actualmente sin lesiones cutáneas. Vigilancia estrecha.', 1)
    `, [franciscoId, now, franciscoNorton]);
    console.log("  ✓ Escala Norton insertada (8 pts - Muy alto riesgo UPP)");

    // Notas de enfermería de Francisco
    await connection.execute(`
      INSERT INTO nursingNotes (residentId, category, title, content, priority, noteDate, createdBy)
      VALUES 
        (?, 'nutrition', 'Administración nutrición enteral', 'Se administran 5 tomas de Nutrison Energy 1.5 (300ml cada una) a las 08:00, 12:00, 16:00, 20:00 y 00:00h. Buena tolerancia. Sin residuo gástrico significativo. Cabecero a 45° durante administración y 1h después.', 'normal', ?, 1),
        (?, 'hygiene', 'Higiene y cuidados', 'Baño en cama completo. Cambio de pañal c/3h y cuando precisa. Piel íntegra en zonas de presión. Se aplica crema hidratante y protección en prominencias óseas. SNG permeable, fijación correcta, sin irritación nasal.', 'normal', ?, 1),
        (?, 'mobility', 'Movilización con grúa', 'Se moviliza al residente de cama a sillón mediante grúa a las 10:00h. Permanece en sillón hasta las 18:00h. Se realizan cambios posturales en sillón y ejercicios pasivos de miembros por fisioterapeuta. Sin incidencias.', 'normal', ?, 1),
        (?, 'general', 'Revisión SNG', 'SNG en buen estado. Próximo cambio programado para el día 15 del próximo mes. Se verifica posición antes de cada toma mediante auscultación. Sin signos de obstrucción ni reflujo.', 'high', ?, 1)
    `, [franciscoId, now, franciscoId, yesterday, franciscoId, twoDaysAgo, franciscoId, weekAgo]);
    console.log("  ✓ Notas de enfermería insertadas\n");

    await connection.end();

    console.log("═══════════════════════════════════════════════════════════════");
    console.log("✅ ¡4 residentes creados exitosamente en Residencia Petrescu!");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("\n📋 Resumen de residentes creados:");
    console.log("  1. Pilar Moreno Castillo (ID: " + pilarId + ") - Independiente, Sintrom, HTA");
    console.log("  2. Dolores Fernández Ruiz (ID: " + doloresId + ") - Alzheimer, Dependiente severa, ITU");
    console.log("  3. Manuel García Hernández (ID: " + manuelId + ") - Úlceras II, Diabético, Cambios c/2h");
    console.log("  4. Francisco Jiménez Torres (ID: " + franciscoId + ") - SNG, Silla de ruedas, Grúa, Pañal");
    console.log("\n");

  } catch (error) {
    console.error("❌ Error creando residentes:", error);
    process.exit(1);
  }
}

seedPetrescuResidents();

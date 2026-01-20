import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Datos de residentes variados
const residents = [
  {
    code: 'RES003',
    nif: '12345678A',
    nss: '281234567890',
    nsip: 'NSIP003',
    firstName: 'María',
    lastName: 'García López',
    birthDate: new Date('1940-03-15'),
    gender: 'Femenino',
    birthPlace: 'Toledo',
    admissionDate: new Date('2020-06-10'),
    lastAdmissionDate: new Date('2020-06-10'),
    roomId: 1,
    bedNumber: '1',
    status: 'Activo',
    phone: '925111222',
    email: null,
    emergencyContact: 'Pedro García',
    emergencyPhone: '666111222',
    emergencyRelation: 'Hijo',
    medicalNotes: 'Hipertensión arterial controlada',
    allergies: 'Penicilina',
    specialNeeds: 'Dieta baja en sal'
  },
  {
    code: 'RES004',
    nif: '23456789B',
    nss: '281234567891',
    nsip: 'NSIP004',
    firstName: 'José',
    lastName: 'Martínez Sánchez',
    birthDate: new Date('1935-07-22'),
    gender: 'Masculino',
    birthPlace: 'Ciudad Real',
    admissionDate: new Date('2019-03-15'),
    lastAdmissionDate: new Date('2019-03-15'),
    roomId: 1,
    bedNumber: '2',
    status: 'Activo',
    phone: '926222333',
    email: null,
    emergencyContact: 'Ana Martínez',
    emergencyPhone: '677222333',
    emergencyRelation: 'Hija',
    medicalNotes: 'Diabetes tipo 2, Alzheimer leve',
    allergies: 'Ninguna conocida',
    specialNeeds: 'Dieta diabética, supervisión constante'
  },
  {
    code: 'RES005',
    nif: '34567890C',
    nss: '281234567892',
    nsip: 'NSIP005',
    firstName: 'Carmen',
    lastName: 'Rodríguez Pérez',
    birthDate: new Date('1945-11-08'),
    gender: 'Femenino',
    birthPlace: 'Cuenca',
    admissionDate: new Date('2021-01-20'),
    lastAdmissionDate: new Date('2021-01-20'),
    roomId: 2,
    bedNumber: '1',
    status: 'Activo',
    phone: '969333444',
    email: null,
    emergencyContact: 'Luis Rodríguez',
    emergencyPhone: '688333444',
    emergencyRelation: 'Hijo',
    medicalNotes: 'Artrosis severa, movilidad reducida',
    allergies: 'Látex',
    specialNeeds: 'Ayuda para movilización, fisioterapia'
  },
  {
    code: 'RES006',
    nif: '45678901D',
    nss: '281234567893',
    nsip: 'NSIP006',
    firstName: 'Francisco',
    lastName: 'López Fernández',
    birthDate: new Date('1938-05-30'),
    gender: 'Masculino',
    birthPlace: 'Albacete',
    admissionDate: new Date('2018-09-05'),
    lastAdmissionDate: new Date('2018-09-05'),
    roomId: 2,
    bedNumber: '2',
    status: 'Hospitalizado',
    phone: '967444555',
    email: null,
    emergencyContact: 'Isabel López',
    emergencyPhone: '699444555',
    emergencyRelation: 'Esposa',
    medicalNotes: 'EPOC, insuficiencia cardíaca',
    allergies: 'Aspirina',
    specialNeeds: 'Oxigenoterapia nocturna'
  },
  {
    code: 'RES007',
    nif: '56789012E',
    nss: '281234567894',
    nsip: 'NSIP007',
    firstName: 'Dolores',
    lastName: 'Jiménez Moreno',
    birthDate: new Date('1942-12-18'),
    gender: 'Femenino',
    birthPlace: 'Guadalajara',
    admissionDate: new Date('2020-11-12'),
    lastAdmissionDate: new Date('2020-11-12'),
    roomId: 3,
    bedNumber: '1',
    status: 'Activo',
    phone: '949555666',
    email: null,
    emergencyContact: 'Miguel Jiménez',
    emergencyPhone: '600555666',
    emergencyRelation: 'Hijo',
    medicalNotes: 'Parkinson, temblor en manos',
    allergies: 'Ninguna conocida',
    specialNeeds: 'Ayuda para alimentación'
  }
];

console.log('Insertando residentes adicionales...');

for (const resident of residents) {
  try {
    await db.execute(`
      INSERT INTO residents (
        code, nif, nss, nsip, firstName, lastName, birthDate, gender, birthPlace,
        admissionDate, lastAdmissionDate, roomId, bedNumber, status,
        phone, email, emergencyContact, emergencyPhone, emergencyRelation,
        medicalNotes, allergies, specialNeeds, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      resident.code, resident.nif, resident.nss, resident.nsip,
      resident.firstName, resident.lastName, resident.birthDate, resident.gender, resident.birthPlace,
      resident.admissionDate, resident.lastAdmissionDate, resident.roomId, resident.bedNumber, resident.status,
      resident.phone, resident.email, resident.emergencyContact, resident.emergencyPhone, resident.emergencyRelation,
      resident.medicalNotes, resident.allergies, resident.specialNeeds
    ]);
    console.log(`✓ Residente ${resident.firstName} ${resident.lastName} insertado`);
  } catch (error) {
    console.log(`✗ Error al insertar ${resident.firstName} ${resident.lastName}:`, error.message);
  }
}

console.log('\n✓ Proceso completado');
await connection.end();

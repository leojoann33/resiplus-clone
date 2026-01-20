import jwt from "jsonwebtoken";

// Obtener credenciales del archivo .env
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "hermana";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";
const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_super_segura_aqui_12345";

interface AuthPayload {
  username: string;
  iat: number;
  exp: number;
}

/**
 * Valida las credenciales de usuario
 * @param username - Nombre de usuario
 * @param password - Contraseña
 * @returns Token JWT si las credenciales son válidas
 */
export function validateCredentials(
  username: string,
  password: string
): string | null {
  // Comparar credenciales (Admin Default)
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return generateToken(username, "admin");
  }

  // Credenciales específicas (Mirela Petrescu - Superusuario)
  if (username === "mirela-petrescu" && password === "isabela1") {
    // Usamos el mismo openId que en la base de datos para que el contexto lo enlace
    return generateToken("mirela-petrescu", "admin");
  }

  return null;
}

function generateToken(username: string, role: string): string {
    return jwt.sign(
      { username, role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
}

/**
 * Verifica si un token JWT es válido
 * @param token - Token JWT
 * @returns Payload del token si es válido, null si no
 */
export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extrae el token del header Authorization
 * @param authHeader - Header Authorization
 * @returns Token sin el prefijo "Bearer "
 */
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  return null;
}

/**
 * Middleware para verificar autenticación
 * @param token - Token JWT
 * @returns true si el token es válido
 */
export function isAuthenticated(token: string | undefined): boolean {
  if (!token) return false;
  const extracted = extractToken(`Bearer ${token}`);
  if (!extracted) return false;
  return verifyToken(extracted) !== null;
}

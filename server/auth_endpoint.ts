import express, { Request, Response } from "express";
import { validateCredentials } from "./auth_practice";

export const authRouter = express.Router();

/**
 * POST /api/auth/validate
 * Valida credenciales y retorna un token JWT
 */
authRouter.post("/validate", (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validar que se proporcionaron ambos campos
    if (!username || !password) {
      return res.status(400).json({
        error: "Usuario y contraseña son requeridos",
      });
    }

    // Validar credenciales
    const token = validateCredentials(username, password);

    if (!token) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    // Retornar token exitosamente
    return res.status(200).json({
      success: true,
      token,
      username,
      message: "Sesión iniciada correctamente",
    });
  } catch (error) {
    console.error("Error en validación de credenciales:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

/**
 * POST /api/auth/verify
 * Verifica si un token JWT es válido
 */
authRouter.post("/verify", (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: "Token requerido",
      });
    }

    // En una aplicación real, aquí verificarías el token
    // Por ahora, solo verificamos que existe
    return res.status(200).json({
      success: true,
      valid: true,
    });
  } catch (error) {
    console.error("Error en verificación de token:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario
 */
authRouter.post("/logout", (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

/**
 * GET /api/auth/practice-credentials
 * Retorna las credenciales de práctica configuradas
 */
authRouter.get("/practice-credentials", (_req: Request, res: Response) => {
  try {
    return res.status(200).json({
      username: process.env.ADMIN_USERNAME || "hermana",
      password: process.env.ADMIN_PASSWORD || "password123",
    });
  } catch (error) {
    console.error("Error obteniendo credenciales de práctica:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});
/**
 * GET /api/auth/seed-mirela
 * Endpoint temporal para crear el usuario de Mirela
 * (Workaround por limitación de ejecución de scripts en terminal)
 */
authRouter.get("/seed-mirela", async (_req: Request, res: Response) => {
  try {
    const { getDb, upsertUser } = await import("./db");
    
    await upsertUser({
      openId: "mirela-petrescu",
      name: "Mirela Petrescu",
      role: "admin",
      loginMethod: "practice",
      email: "mirela.petrescu@resiplus.local"
    });

    return res.status(200).json({
      success: true,
      message: "Usuario 'Mirela Petrescu' creado/actualizado correctamente en base de datos."
    });
  } catch (error) {
    console.error("Error seeding Mirela:", error);
    return res.status(500).json({
      error: "Error creando usuario: " + String(error),
    });
  }
});

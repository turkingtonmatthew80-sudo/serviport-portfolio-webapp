import { doc, setDoc, updateDoc, arrayUnion } from "@/src/lib/db-wrapper";
import { db } from "./firebase";

export type AuditSeverity = "INFO" | "WARNING" | "CRITICAL" | "ERROR";

export interface AppAuditLog {
  logId: string;
  timestamp_ms: number;
  actor: string;
  rol: string;
  accion: string;
  gravedad: AuditSeverity;
}

/**
 * Registra un log de auditoría dentro de un Cycle ID Macro (Vessel o Container).
 * Utiliza arrayUnion con UUIDs matemáticamente únicos para evadir duplicaciones silenciosas en modo offline.
 */
export async function logAuditAction(
  arg1: string,
  arg2?: string,
  arg3?: string,
  arg4?: string,
  arg5?: AuditSeverity
) {
  try {
    let cycleId = "GENERAL_LOGS";
    let accion = "";
    let actorUid = "system";
    let rol = "GERENTE_GENERAL";
    let gravedad: AuditSeverity = "INFO";

    // Backwards compatibility check
    // If the 2nd arg is missing or likely a role
    if (!arg2 || ["GERENTE_GENERAL", "OFICIAL_BUQUES", "SUPERADMIN"].includes(arg2) || arg2.includes("@")) {
      // old signature: logAuditAction(action, userRole, userEmail)
      accion = arg1;
      rol = arg2 || "GERENTE_GENERAL";
      actorUid = arg3 || "system";
    } else {
      // new signature: logAuditAction(cycleId, accion, actorUid, rol, gravedad)
      cycleId = arg1;
      accion = arg2;
      actorUid = arg3 || "system";
      rol = arg4 || "GERENTE_GENERAL";
      gravedad = arg5 || "INFO";
    }

    const logId = crypto.randomUUID();
    const timestamp_ms = Date.now();

    const logEntry: AppAuditLog = {
      logId,
      timestamp_ms,
      actor: actorUid,
      rol,
      accion,
      gravedad
    };

    const docRef = doc(db, "audit_logs", cycleId);

    // Intentamos actualizar con arrayUnion
    try {
      await updateDoc(docRef, {
        logs: arrayUnion(logEntry),
        lastUpdated: timestamp_ms
      });
    } catch (e: any) {
      // Si el documento macro no existe, lo creamos y luego insertamos el log.
      if (e.code === "not-found") {
        await setDoc(docRef, {
          cycleId,
          createdAt: timestamp_ms,
          lastUpdated: timestamp_ms,
          logs: [logEntry]
        });
      } else {
        throw e;
      }
    }
  } catch (error) {
    console.error("Failed to log audit action in cycle ID:", arg1, error);
    // Offline caching handling happens natively with Firebase Web SDK (IndexedDB)
  }
}

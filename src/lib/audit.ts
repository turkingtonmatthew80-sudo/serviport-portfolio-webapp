import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function logAuditAction(action: string, userRole: string = "SUPERADMIN", userEmail: string = "") {
  try {
    await addDoc(collection(db, "audit_logs"), {
      action,
      userRole,
      userEmail,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to log audit action", error);
  }
}

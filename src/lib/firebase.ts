import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKiPUS-7IBkYxgygW5kwZG5b3H0BP2LXA",
  authDomain: "serviport-24f31.firebaseapp.com",
  projectId: "serviport-24f31",
  storageBucket: "serviport-24f31.firebasestorage.app",
  messagingSenderId: "20443440053",
  appId: "1:20443440053:web:34b301392ede5602a02ffc",
  measurementId: "G-7ZD8063D0D",
};

const app = initializeApp(firebaseConfig);

export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);

export enum OperationType {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
  GET = "get",
}

export function handleFirestoreError(
  error: any,
  operation: OperationType,
  path: string,
) {
  if (error.code === "unavailable" || error.message?.includes("offline")) {
    console.warn(
      `Firestore ${operation} offline error on path ${path}:`,
      error,
    );
    throw new Error(
      "No se pudo conectar a la base de datos. Asegúrate de haber habilitado Cloud Firestore en la consola de Firebase.",
    );
  }
  console.error(`Firestore ${operation} error on path ${path}:`, error);
  throw error;
}

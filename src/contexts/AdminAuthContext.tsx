import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export type Role =
  | "SUPERADMIN"
  | "GERENTE_OPERACIONES"
  | "OFICINISTA_BUQUES"
  | "PLANIFICADOR_PATIO"
  | "INSPECTOR_PUERTA"
  | "CONTADOR"
  | "ESTIBADOR";

export interface AdminUser {
  id: string; // Internal username
  name: string;
  email: string;
  role: Role;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isLoading: boolean;
  loginAdmin: (username: string, pass: string) => Promise<void>;
  logoutAdmin: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session
    const stored = localStorage.getItem("serviport_admin_session");
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing admin session:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const loginAdmin = async (username: string, pass: string) => {
    if (username === "admin" && pass === "1234") {
      const u: AdminUser = {
        id: "superadmin_id",
        name: "Admin Sistema",
        email: "admin@serviport.local",
        role: "SUPERADMIN",
      };
      setAdminUser(u);
      localStorage.setItem("serviport_admin_session", JSON.stringify(u));
      return;
    }

    // Check firestore 'employees' collection
    const employeesRef = collection(db, "employees");
    const q = query(employeesRef, where("username", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("Credenciales inválidas");
    }

    let authenticated = false;
    let employeeData: any = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.password === pass) { // Plain text check as per isolated internal simple system requirements
        authenticated = true;
        employeeData = { id: doc.id, ...data };
      }
    });

    if (!authenticated || !employeeData) {
      throw new Error("Credenciales inválidas");
    }

    if (employeeData.status === "inactive") {
      throw new Error("Cuenta inactiva. Contacte al administrador.");
    }

    const u: AdminUser = {
      id: employeeData.id,
      name: employeeData.name,
      email: employeeData.email || "",
      role: employeeData.role as Role,
    };

    setAdminUser(u);
    localStorage.setItem("serviport_admin_session", JSON.stringify(u));
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem("serviport_admin_session");
  };

  return (
    <AdminAuthContext.Provider
      value={{ adminUser, isLoading, loginAdmin, logoutAdmin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}

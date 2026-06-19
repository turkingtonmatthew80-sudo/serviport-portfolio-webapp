import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";

export type RoleId =
  | "naviera"
  | "armador"
  | "importador"
  | "exportador"
  | "agente_aduana"
  | "transportista"
  | "consolidador";

export interface User {
  id: string;
  razonSocial: string;
  email: string;
  rif: string;
  roles: RoleId[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  checkIfUserExists: (email: string) => Promise<boolean>;
  register: (user: Omit<User, "id">, password: string) => Promise<boolean>;
  registerGoogleUser: (user: Omit<User, "id">) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          if (!firebaseUser.emailVerified) {
            console.warn("User email not verified. Rejecting session.");
            await signOut(auth);
            setUser(null);
            setIsLoading(false);
            return;
          }

          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setUser({
                id: firebaseUser.uid,
                razonSocial: data.razonSocial || "",
                email: data.email || firebaseUser.email || "",
                rif: data.rif || "",
                roles: data.roles || [],
              });
            } else {
              console.warn(
                "User document not found in Firestore. Strict security requires it.",
              );
              // Do not aggressively sign out here, because the B2BRegisterPage Google autofill
              // relies on the Firebase user session being active to create the document in step 3.
              setUser(null);
            }
          } catch (error: any) {
            console.warn("Failed to fetch user doc from Firestore:", error);
            if (
              error.code === "unavailable" ||
              error.message?.includes("offline")
            ) {
              console.error(
                "Firestore is offline or not enabled. Auth is blocked to maintain security.",
              );
            }
            await signOut(auth);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      },
    );

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (!userCredential.user.emailVerified) {
        console.warn("User attempted login with unverified email.");
        await signOut(auth);
        throw new Error("auth/unverified-email");
      }

      // Verify user document exists
      try {
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (!userDoc.exists()) {
          console.warn(
            "User authenticated but not found in Firestore DB. Blocking access.",
          );
          await signOut(auth);
          throw new Error("auth/user-not-registered");
        }
      } catch (err: any) {
        if (err.message === "auth/user-not-registered") throw err;
        console.warn(
          "Could not verify user doc in Firestore:",
          err.message || err,
        );
        await signOut(auth);
        throw new Error("auth/database-error");
      }
      return true;
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (!userDoc.exists()) {
          // Si el UID no se encuentra en users, tal vez haya un documento con ese email (creado vía registro si usa firebase Auth pero UID cambia?)
          // Normalmente si usas Google Auth en un correo que ya tenía Email/Pass, Firebase Auth linkea las cuentas (si 'Account linking' está habilitado por email)
          const existsByEmail = await checkIfUserExists(
            firebaseUser.email || "",
          );
          if (!existsByEmail) {
            console.warn("User not registered in db. Google login rejected.");
            await firebaseUser.delete().catch(() => signOut(auth)); // Try deleting the newly created Auth user, or sign out
            throw new Error("auth/user-not-registered");
          } else {
            console.warn(
              "User document doesn't match UID, but email exists. You may need to merge accounts in Firebase.",
            );
            // Si el correo existe en BD bajo otro UID, pero Firebase Auth lo dejó pasar
            // por ahora cerramos sesión para no dar acceso si no coincide el ref doc
            await signOut(auth);
            throw new Error("auth/user-not-registered");
          }
        }
      } catch (dbErr: any) {
        if (dbErr.message === "auth/user-not-registered") throw dbErr;
        console.warn(
          "Could not verify user doc in Firestore during Google Auth:",
          dbErr.message || dbErr,
        );
        await signOut(auth);
        throw new Error("auth/database-error");
      }
      return true;
    } catch (error: any) {
      if (
        error.message !== "auth/user-not-registered" &&
        error.code !== "auth/user-not-registered"
      ) {
        console.error("Google Auth failed:", error);
      }
      throw error;
    }
  };

  const checkIfUserExists = async (email: string) => {
    if (!email) return false;
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking user existence", error);
      return false;
    }
  };

  const register = async (newUser: Omit<User, "id">, password: string) => {
    try {
      const exists = await checkIfUserExists(newUser.email);
      if (exists) {
        throw new Error("auth/email-already-in-use");
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        password,
      );
      const uid = userCredential.user.uid;

      try {
        await sendEmailVerification(userCredential.user);
      } catch (err) {
        console.error("Could not send verification email", err);
      }

      const firestoreUser = {
        email: newUser.email,
        razonSocial: newUser.razonSocial,
        rif: newUser.rif,
        roles: newUser.roles,
      };

      try {
        await setDoc(doc(db, "users", uid), firestoreUser);
      } catch (error: any) {
        console.warn(
          "Could not write user to db initially, but auth user was created:",
          error,
        );
      }

      // Since email verification is required, sign them out immediately after registration
      await signOut(auth);
      setUser(null);
      return true;
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const registerGoogleUser = async (newUser: Omit<User, "id">) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error("No Google user session found.");

    // We assume email is verified for Google Auth, or we can send verification if needed.
    const firestoreUser = {
      email: newUser.email,
      razonSocial: newUser.razonSocial,
      rif: newUser.rif,
      roles: newUser.roles,
    };

    try {
      await setDoc(doc(db, "users", firebaseUser.uid), firestoreUser);
    } catch (error: any) {
      console.warn("Could not write user to db:", error);
      throw error;
    }

    setUser({
      id: firebaseUser.uid,
      razonSocial: newUser.razonSocial,
      email: newUser.email,
      rif: newUser.rif,
      roles: newUser.roles,
    });
    return true;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const deleteAccount = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) throw new Error("No user session found.");

    try {
      await updateDoc(doc(db, "users", firebaseUser.uid), {
         is_archived: true,
         archived_at: new Date().toISOString(),
         archived_by: firebaseUser.email || "Self"
      });
      await firebaseUser.delete();
      setUser(null);
      return true;
    } catch (error: any) {
      console.error("Delete account error", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Reset password error", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        checkIfUserExists,
        register,
        registerGoogleUser,
        resetPassword,
        logout,
        deleteAccount,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

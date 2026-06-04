import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

export type RoleId = 'naviera' | 'armador' | 'importador' | 'exportador' | 'agente_aduana' | 'transportista';

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
  register: (user: Omit<User, 'id'>, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              razonSocial: data.razonSocial || '',
              email: data.email || firebaseUser.email || '',
              rif: data.rif || '',
              roles: data.roles || [],
            });
          } else {
            console.warn("User document not found in Firestore.");
            setUser(null);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (newUser: Omit<User, 'id'>, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, password);
      const uid = userCredential.user.uid;
      
      const firestoreUser = {
        email: newUser.email,
        razonSocial: newUser.razonSocial,
        rif: newUser.rif,
        roles: newUser.roles,
      };

      try {
        await setDoc(doc(db, 'users', uid), firestoreUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
      }

      setUser({
        id: uid,
        ...firestoreUser
      });
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { collection, doc, getDocs, getDoc, setDoc, writeBatch, serverTimestamp, runTransaction } from "@/src/lib/db-wrapper";
import { db } from "./firebase";

export interface ShippingLine {
  id: string;
  name: string;
  countryOfOrigin: string;
  foundedYear: number;
  website: string;
  description: string;
  globalRank?: number;
  fleetSize?: number;
  teuCapacity?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Vessel {
  id: string; // IMO Number
  imo: string;
  name: string;
  vesselType: string;
  flag: string;
  builtYear: number;
  grossTonnage: number;
  deadweight: number;
  length?: number;
  beam?: number;
  teuCapacity?: number;
  operatorId: string; // matches ShippingLine.id
  status: string; // e.g. "Active", "Decommissioned"
  createdAt?: any;
  updatedAt?: any;
}

export interface Port {
  id: string; // UN/LOCODE
  name: string;
  locode: string;
  country: string;
  city: string;
  coordinates: string; // lat, long
  terminalsCount: number;
  description: string;
  isCustomsEnabled: boolean;
  createdAt?: any;
}

export interface CustomsOffice {
  id: string;
  name: string;
  code: string; // e.g., 2001 for Puerto Cabello
  jurisdiction: string;
  locationId: string; // matches Port.id if applicable
  description: string;
  established: string;
  createdAt?: any;
}

// Collections
export const LINES_COLLECTION = "registry_lines";
export const VESSELS_COLLECTION = "registry_vessels";
export const PORTS_COLLECTION = "registry_ports";
export const CUSTOMS_COLLECTION = "registry_customs";

export class RegistryService {

  // ACID transaction example for adding a vessel and updating line fleet count
  static async registerVesselWithLineUpdate(vesselData: Omit<Vessel, "id" | "createdAt" | "updatedAt">) {
    const vesselRef = doc(db, VESSELS_COLLECTION, vesselData.imo);
    const lineRef = doc(db, LINES_COLLECTION, vesselData.operatorId);

    try {
      await runTransaction(db, async (transaction) => {
        const lineDoc = await transaction.get(lineRef);
        
        // Even if line doesn't exist, we can register the vessel, but normally we'd want validation
        
        transaction.set(vesselRef, {
          ...vesselData,
          id: vesselData.imo,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        if (lineDoc.exists()) {
          const newFleetSize = ((lineDoc.data() as any).fleetSize || 0) + 1;
          transaction.update(lineRef, {
            fleetSize: newFleetSize,
            updatedAt: serverTimestamp()
          });
        }
      });
      return { success: true, imo: vesselData.imo };
    } catch (error) {
      console.error("ACID Transaction failed: ", error);
      throw error;
    }
  }

  // Batch insert method
  static async seedInitialEntities(lines: ShippingLine[], vessels: Vessel[], ports: Port[], customs: CustomsOffice[]) {
    const batch = writeBatch(db);

    lines.forEach(l => {
      const ref = doc(db, LINES_COLLECTION, l.id);
      batch.set(ref, { ...l, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    });

    vessels.forEach(v => {
      const ref = doc(db, VESSELS_COLLECTION, v.id);
      batch.set(ref, { ...v, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    });

    ports.forEach(p => {
      const ref = doc(db, PORTS_COLLECTION, p.id);
      batch.set(ref, { ...p, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    });

    customs.forEach(c => {
      const ref = doc(db, CUSTOMS_COLLECTION, c.id);
      batch.set(ref, { ...c, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    });

    await batch.commit();
  }

  static async getLines() {
    const q = collection(db, LINES_COLLECTION);
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as ShippingLine);
  }

  static async getVessels() {
    const q = collection(db, VESSELS_COLLECTION);
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Vessel);
  }

  static async getPorts() {
    const q = collection(db, PORTS_COLLECTION);
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Port);
  }

  static async getCustoms() {
    const q = collection(db, CUSTOMS_COLLECTION);
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as CustomsOffice);
  }
}

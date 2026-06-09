import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface TradeVesselMovements {
  mmsi: number;
  shipName: string;
  type: 'import' | 'export';
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  date: string;
  port: string;
}

interface ShipDB extends DBSchema {
  ships: {
    key: string;
    value: TradeVesselMovements;
    indexes: { 'by-port': string };
  };
}

let dbPromise: Promise<IDBPDatabase<ShipDB>> | null = null;

if (typeof window !== 'undefined') {
  dbPromise = openDB<ShipDB>('venezuelan-maritime-db', 1, {
    upgrade(db) {
      const store = db.createObjectStore('ships', {
        keyPath: 'id',
      });
      store.createIndex('by-port', 'port');
    },
  });
}

export async function saveShipRecords(ships: Omit<TradeVesselMovements, 'id'>[], port: string) {
  if (!dbPromise) return;
  const db = await dbPromise;
  const tx = db.transaction('ships', 'readwrite');
  
  for (const ship of ships) {
    const id = `${port}-${ship.mmsi}-${ship.date}`; // Unique composite key
    tx.store.put({ ...ship, port, id } as any);
  }
  
  await tx.done;
}

export async function getShipRecordsByPort(port: string): Promise<TradeVesselMovements[]> {
  if (!dbPromise) return [];
  const db = await dbPromise;
  return db.getAllFromIndex('ships', 'by-port', port);
}

export async function getAllShipRecords(): Promise<TradeVesselMovements[]> {
  if (!dbPromise) return [];
  const db = await dbPromise;
  return db.getAll('ships');
}

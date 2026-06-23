export * from "firebase/firestore";

import {
  collection as fbCollection,
  doc as fbDoc,
  query as fbQuery,
  where as fbWhere,
  orderBy as fbOrderBy,
  limit as fbLimit,
  getDocs as fbGetDocs,
  getDoc as fbGetDoc,
  onSnapshot as fbOnSnapshot,
  addDoc as fbAddDoc,
  updateDoc as fbUpdateDoc,
  setDoc as fbSetDoc,
  deleteDoc as fbDeleteDoc,
  writeBatch as fbWriteBatch,
} from "firebase/firestore";
import { db as firebaseDb } from "./firebase";

// List of tables migrated to Cloud SQL (Neon)
const sqlTables = [
  'users', 'portcalls', 'yard_movements', 'gate_events', 'approvals', 
  'patios', 'crews', 'employees', 'newsletter_subscribers', 'hitos_legales', 
  'eir_orders', 'contenedores', 'tariffs', 'invoices', 'facturas_pendientes', 
  'consultas', 'audit_logs'
];

function isSql(path: string) {
  const table = path.split('/')[0];
  return sqlTables.includes(table);
}

// Dummy classes for SQL queries to simulate Firebase's API
class SqlCollection {
  constructor(public path: string) {}
}

class SqlDoc {
  public id: string;
  constructor(public path: string) {
    this.id = path.split('/').pop() || "";
  }
}

class SqlQuery {
  constructor(public collection: SqlCollection, public filters: any[]) {}
}

// Wrapper for collection
export const collection: any = function(dbArgs: any, path: string, ...pathSegments: string[]): any {
  const fullPath = [path, ...pathSegments].join('/');
  if (isSql(fullPath)) return new SqlCollection(fullPath);
  return fbCollection(firebaseDb, path, ...pathSegments);
}

// Wrapper for doc
export const doc: any = function(dbArgs: any, ...pathSegments: string[]): any {
  let path = "";
  if (typeof dbArgs === 'string') {
    path = [dbArgs, ...pathSegments].join('/');
    if (isSql(path)) return new SqlDoc(path);
    return fbDoc(firebaseDb, dbArgs, ...pathSegments);
  } else {
    if (pathSegments.length === 0) {
       return new SqlDoc(`dummy/${crypto.randomUUID()}`);
    }
    path = pathSegments.join('/');
    if (isSql(path)) return new SqlDoc(path);
    return fbDoc(firebaseDb, pathSegments[0], ...pathSegments.slice(1));
  }
}

// Wrapper for query
export const query: any = function(collectionRef: any, ...constraints: any[]): any {
  if (collectionRef instanceof SqlCollection) {
    return new SqlQuery(collectionRef, constraints);
  }
  return fbQuery(collectionRef, ...constraints);
}

export const where: any = function(field: string, op: string, value: any): any {
  return { type: 'where', field, op, value };
}

export const orderBy: any = function(field: string, direction: string = 'asc'): any {
  return { type: 'orderBy', field, direction };
}

export const limit: any = function(count: number): any {
  return { type: 'limit', count };
}

// Wrapper for getDocs
export const getDocs: any = async function(queryRef: any): Promise<any> {
  if (queryRef instanceof SqlCollection || queryRef instanceof SqlQuery) {
    let collectionPath = queryRef instanceof SqlCollection ? queryRef.path : queryRef.collection.path;
    let url = `/api/sql/${collectionPath}`;
    
    if (queryRef instanceof SqlQuery) {
       const params = new URLSearchParams();
       params.append('filters', JSON.stringify(queryRef.filters));
       url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("SQL fetch error");
    const data = await res.json();
    return {
      docs: data.map((item: any) => ({
        id: item.id.toString(),
        data: () => item,
        ref: new SqlDoc(`${collectionPath}/${item.id}`)
      })),
      empty: data.length === 0,
      size: data.length,
      forEach: function(cb: (doc: any) => void) {
        this.docs.forEach(cb);
      }
    };
  }
  return fbGetDocs(queryRef);
}

// Wrapper for onSnapshot (SQL falls back to standard fetch immediately for MVP)
export const getDoc: any = async function(docRef: any): Promise<any> {
  if (docRef instanceof SqlDoc) {
     const res = await fetch(`/api/sql/${docRef.path}`);
     if (!res.ok) throw new Error("Fetch error getDoc");
     let data = await res.json();
     if (Array.isArray(data)) data = data[0]; 
     
     return {
       exists: () => !!data,
       data: () => data,
       id: docRef.id
     };
  }
  return fbGetDoc(docRef);
}

// Wrapper for onSnapshot (SQL falls back to standard fetch immediately for MVP)
export const onSnapshot: any = function(queryRef: any, callback: (snap: any) => void, errorCallback?: (error: any) => void): any {
  if (queryRef instanceof SqlCollection || queryRef instanceof SqlQuery) {
    getDocs(queryRef).then(callback).catch(errorCallback || console.error);
    const interval = setInterval(() => {
      getDocs(queryRef).then(callback).catch(errorCallback || console.error);
    }, 10000);
    return () => clearInterval(interval);
  }
  return fbOnSnapshot(queryRef, callback, errorCallback);
}

export const addDoc: any = async function(collectionRef: any, data: any) {
  if (collectionRef instanceof SqlCollection) {
    const res = await fetch(`/api/sql/${collectionRef.path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    return new SqlDoc(`${collectionRef.path}/${result.id}`);
  }
  return fbAddDoc(collectionRef, data);
}

export const updateDoc: any = async function(docRef: any, data: any) {
  if (docRef instanceof SqlDoc) {
    await fetch(`/api/sql/${docRef.path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return;
  }
  return fbUpdateDoc(docRef, data);
}

export const setDoc: any = async function(docRef: any, data: any) {
  if (docRef instanceof SqlDoc) {
    await fetch(`/api/sql/${docRef.path}`, {
      method: 'PUT', // simple upsert behavior
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, _isSet: true })
    });
    return;
  }
  return fbSetDoc(docRef, data);
}

export const deleteDoc: any = async function(docRef: any) {
  if (docRef instanceof SqlDoc) {
    await fetch(`/api/sql/${docRef.path}`, {
      method: 'DELETE'
    });
    return;
  }
  return fbDeleteDoc(docRef);
}

export const writeBatch: any = function(db: any) {
  // basic stub, ideally we do a real bulk endpoint
  let stubs: any[] = [];
  return {
    set: (ref: any, data: any) => stubs.push(() => setDoc(ref, data)),
    update: (ref: any, data: any) => stubs.push(() => updateDoc(ref, data)),
    delete: (ref: any) => stubs.push(() => deleteDoc(ref)),
    commit: async () => {
      for (const fn of stubs) await fn();
    }
  };
}

import { GeoPoint, Incident } from "./safety-engine";

export type OfflineEventType = 
  | "SOS_CREATION" 
  | "LOCATION_UPDATE" 
  | "EMERGENCY_CONTACT_ALERT" 
  | "GEOFENCE_WARNING" 
  | "SAFETY_STATUS_CHANGE";

export type SyncStatus = "queued" | "syncing" | "synced" | "failed";

export type OfflineEventRecord = {
  eventId: string;
  sessionId: string;
  eventType: OfflineEventType;
  timestamp: string;
  location: GeoPoint;
  locationName: string;
  payload: Record<string, any>;
  syncStatus: SyncStatus;
  retryCount: number;
  lastRetryAt?: string;
  errorMessage?: string;
};

const DB_NAME = "suraksha_link_offline_db";
const DB_VERSION = 1;
const STORE_NAME = "event_queue";

class OfflineEventStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !("indexedDB" in window)) {
        reject(new Error("IndexedDB is not supported in this environment"));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "eventId" });
          store.createIndex("syncStatus", "syncStatus", { unique: false });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  async enqueueEvent(event: OfflineEventRecord): Promise<void> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const putReq = store.put(event);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      });
    } catch (err) {
      console.warn("[OfflineQueue] IndexedDB fallback to localStorage:", err);
      const items = this.getLocalStorageQueue();
      const filtered = items.filter(e => e.eventId !== event.eventId);
      filtered.push(event);
      localStorage.setItem("suraksha_offline_fallback_queue", JSON.stringify(filtered));
    }
  }

  async getQueuedEvents(): Promise<OfflineEventRecord[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
          const all = (request.result as OfflineEventRecord[]) || [];
          resolve(all.filter(e => e.syncStatus === "queued" || e.syncStatus === "failed"));
        };
        request.onerror = () => reject(request.error);
      });
    } catch {
      return this.getLocalStorageQueue().filter(e => e.syncStatus === "queued" || e.syncStatus === "failed");
    }
  }

  async getAllEvents(): Promise<OfflineEventRecord[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve((request.result as OfflineEventRecord[]) || []);
        request.onerror = () => reject(request.error);
      });
    } catch {
      return this.getLocalStorageQueue();
    }
  }

  async markSynced(eventId: string): Promise<void> {
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(eventId);
        getReq.onsuccess = () => {
          const item = getReq.result as OfflineEventRecord;
          if (item) {
            item.syncStatus = "synced";
            store.put(item);
          }
          resolve();
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch {
      const items = this.getLocalStorageQueue();
      const updated = items.map(e => e.eventId === eventId ? { ...e, syncStatus: "synced" as SyncStatus } : e);
      localStorage.setItem("suraksha_offline_fallback_queue", JSON.stringify(updated));
    }
  }

  private getLocalStorageQueue(): OfflineEventRecord[] {
    if (typeof localStorage === "undefined") return [];
    try {
      const raw = localStorage.getItem("suraksha_offline_fallback_queue");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const offlineQueueStorage = new OfflineEventStorage();

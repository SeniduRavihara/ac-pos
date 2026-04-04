import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot,
  where
} from "firebase/firestore";

export interface MaintenanceRecord {
  id: string;
  saleId: string;
  customerId: string;
  customerName: string;
  productId: string;
  serialNumber: string;
  lastServiceDate: number;
  nextServiceDate: number;
  status: "Scheduled" | "Completed" | "Overdue";
  notes?: string;
  technicianName?: string;
  createdAt: number;
}

export class MaintenanceService {
  private static COLLECTION = "maintenance";

  /**
   * Create or update a maintenance record
   */
  static async saveMaintenanceRecord(record: Partial<MaintenanceRecord>): Promise<void> {
    const id = record.id || doc(collection(db, this.COLLECTION)).id;
    const docRef = doc(db, this.COLLECTION, id);
    
    await setDoc(docRef, {
      ...record,
      id,
      createdAt: record.createdAt || Date.now(),
    }, { merge: true });
  }

  /**
   * Delete a maintenance record
   */
  static async deleteMaintenanceRecord(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await deleteDoc(docRef);
  }

  /**
   * Get maintenance history by customer
   */
  static async getHistoryByCustomer(customerId: string): Promise<MaintenanceRecord[]> {
    const q = query(
        collection(db, this.COLLECTION), 
        where("customerId", "==", customerId),
        orderBy("nextServiceDate", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as MaintenanceRecord);
  }

  /**
   * Listen to all upcoming maintenance tasks
   */
  static listenToUpcomingMaintenance(callback: (records: MaintenanceRecord[]) => void) {
    const q = query(
        collection(db, this.COLLECTION), 
        orderBy("nextServiceDate", "asc")
    );
    return onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => doc.data() as MaintenanceRecord);
      callback(records);
    });
  }
}

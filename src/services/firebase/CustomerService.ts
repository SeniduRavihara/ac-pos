import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot
} from "firebase/firestore";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  createdAt: number;
}

export class CustomerService {
  private static COLLECTION = "customers";

  /**
   * Create or update a customer record
   */
  static async saveCustomer(customer: Partial<Customer>): Promise<string> {
    const id = customer.id || doc(collection(db, this.COLLECTION)).id;
    const docRef = doc(db, this.COLLECTION, id);
    
    await setDoc(docRef, {
      ...customer,
      id,
      createdAt: customer.createdAt || Date.now(),
    }, { merge: true });

    return id;
  }

  /**
   * Delete a customer record
   */
  static async deleteCustomer(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await deleteDoc(docRef);
  }

  /**
   * Get all customers
   */
  static async getCustomers(): Promise<Customer[]> {
    const q = query(collection(db, this.COLLECTION), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Customer);
  }

  /**
   * Listen to real-time updates for customers
   */
  static listenToCustomers(callback: (customers: Customer[]) => void) {
    const q = query(collection(db, this.COLLECTION), orderBy("name", "asc"));
    return onSnapshot(q, (snapshot) => {
      const customers = snapshot.docs.map(doc => doc.data() as Customer);
      callback(customers);
    });
  }
}

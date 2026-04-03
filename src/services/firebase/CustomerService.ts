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
   * Listen to real-time updates for customers (Hardcoded fallback)
   */
  static listenToCustomers(callback: (customers: Customer[]) => void) {
    const mockCustomers: Customer[] = [
      {
        id: "cust-1",
        name: "John Doe",
        phone: "0771234567",
        email: "john@example.com",
        address: "123, Galle Road, Colombo 03",
        createdAt: Date.now()
      },
      {
        id: "cust-2",
        name: "Global Tech Solutions",
        phone: "0112345678",
        email: "contact@globaltech.lk",
        address: "No 45, Highlevel Road, Nugegoda",
        createdAt: Date.now()
      },
      {
        id: "cust-3",
        name: "Sarah Wijesinghe",
        phone: "0719876543",
        email: "sarah@gmail.com",
        address: "56/A, Kandy Road, Kiribathgoda",
        createdAt: Date.now()
      }
    ];

    callback(mockCustomers);

    const q = query(collection(db, this.COLLECTION), orderBy("name", "asc"));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const customers = snapshot.docs.map(doc => doc.data() as Customer);
        callback(customers);
      }
    });
  }
}

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

export interface Brand {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
}

export class BrandService {
  private static COLLECTION = "brands";

  /**
   * Create or update a brand
   */
  static async saveBrand(brand: Partial<Brand>): Promise<void> {
    const id = brand.id || doc(collection(db, this.COLLECTION)).id;
    const docRef = doc(db, this.COLLECTION, id);
    
    await setDoc(docRef, {
      ...brand,
      id,
      createdAt: brand.createdAt || Date.now(),
    }, { merge: true });
  }

  /**
   * Delete a brand
   */
  static async deleteBrand(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await deleteDoc(docRef);
  }

  /**
   * Get all brands
   */
  static async getBrands(): Promise<Brand[]> {
    const q = query(collection(db, this.COLLECTION), orderBy("name", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Brand);
  }

  /**
   * Listen to real-time updates for brands
   */
  static listenToBrands(callback: (brands: Brand[]) => void) {
    const q = query(collection(db, this.COLLECTION), orderBy("name", "asc"));
    return onSnapshot(q, (snapshot) => {
      const brands = snapshot.docs.map(doc => doc.data() as Brand);
      callback(brands);
    });
  }
}

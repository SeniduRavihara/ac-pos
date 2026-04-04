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

export type ACType = "Split" | "Window" | "Cassette" | "Portable" | "Tower";
export type InverterType = "Inverter" | "Non-Inverter";

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  modelNumber: string;
  btu: number; // e.g. 9000, 12000, 18000, 24000
  type: ACType;
  inverter: InverterType;
  price: number;
  stock: number;
  serialNumbers: string[]; // Track each unit's serial number
  description?: string;
  createdAt: number;
}

export class ProductService {
  private static COLLECTION = "products";

  /**
   * Create or update a product
   */
  static async saveProduct(product: Partial<Product>): Promise<void> {
    const id = product.id || doc(collection(db, this.COLLECTION)).id;
    const docRef = doc(db, this.COLLECTION, id);
    
    await setDoc(docRef, {
      ...product,
      id,
      createdAt: product.createdAt || Date.now(),
      serialNumbers: product.serialNumbers || [],
    }, { merge: true });
  }

  /**
   * Delete a product
   */
  static async deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, this.COLLECTION, id);
    await deleteDoc(docRef);
  }

  /**
   * Get all products
   */
  static async getProducts(): Promise<Product[]> {
    const q = query(collection(db, this.COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Product);
  }

  /**
   * Get products by brand
   */
  static async getProductsByBrand(brandId: string): Promise<Product[]> {
    const q = query(
        collection(db, this.COLLECTION), 
        where("brandId", "==", brandId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Product);
  }

  /**
   * Listen to real-time updates for products
   */
  static listenToProducts(callback: (products: Product[]) => void) {
    const q = query(collection(db, this.COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => doc.data() as Product);
      callback(products);
    });
  }
}

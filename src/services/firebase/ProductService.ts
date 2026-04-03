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
   * Listen to real-time updates for products (Hardcoded fallback)
   */
  static listenToProducts(callback: (products: Product[]) => void) {
    const mockProducts: Product[] = [
      {
        id: "prod-1",
        brandId: "brand-1",
        brandName: "Panasonic",
        modelNumber: "PAN-INV-1.5",
        btu: 18000,
        type: "Split",
        inverter: "Inverter",
        price: 145000,
        stock: 12,
        serialNumbers: ["SN-1001", "SN-1002"],
        createdAt: Date.now()
      },
      {
        id: "prod-2",
        brandId: "brand-2",
        brandName: "Daikin",
        modelNumber: "DAI-STD-1.0",
        btu: 12000,
        type: "Split",
        inverter: "Non-Inverter",
        price: 95000,
        stock: 3,
        serialNumbers: ["SN-2001"],
        createdAt: Date.now()
      },
      {
        id: "prod-3",
        brandId: "brand-3",
        brandName: "Mitsubishi",
        modelNumber: "MIT-INV-2.0",
        btu: 24000,
        type: "Cassette",
        inverter: "Inverter",
        price: 210000,
        stock: 8,
        serialNumbers: ["SN-3001", "SN-3002"],
        createdAt: Date.now()
      }
    ];

    callback(mockProducts);
    
    const q = query(collection(db, this.COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const products = snapshot.docs.map(doc => doc.data() as Product);
        callback(products);
      }
    });
  }
}

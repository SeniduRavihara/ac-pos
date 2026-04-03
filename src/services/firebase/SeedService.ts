import { BrandService } from "./BrandService";
import { ProductService, ACType } from "./ProductService";
import { CustomerService } from "./CustomerService";
import { MaintenanceService } from "./MaintenanceService";
import { db } from "@/lib/firebase";
import { collection, doc } from "firebase/firestore";

export class SeedService {
  static async seedAll() {
    console.log("Starting seed process...");
    
    // 1. Seed Brands
    const brandIds: {id: string, name: string}[] = [];
    const brands = ["Panasonic", "Daikin", "Mitsubishi", "LG", "Samsung"];
    for (const name of brands) {
      const id = doc(collection(db, "brands")).id;
      await BrandService.saveBrand({ id, name, description: `Premium AC units from ${name}` });
      brandIds.push({ id, name });
    }

    // 2. Seed Customers
    const customersForRelationships: {id: string, name: string}[] = [];
    const mockCustomers = [
      { name: "John Doe", phone: "0771234567", address: "123, Galle Road, Colombo 03", email: "john@example.com" },
      { name: "Global Tech Solutions", phone: "0112345678", address: "No 45, Highlevel Road, Nugegoda", email: "contact@globaltech.lk" },
      { name: "Sarah Wijesinghe", phone: "0719876543", address: "56/A, Kandy Road, Kiribathgoda", email: "sarah@gmail.com" }
    ];
    for (const c of mockCustomers) {
      const id = await CustomerService.saveCustomer(c);
      customersForRelationships.push({ id, name: c.name });
    }

    // 3. Seed Products
    const products = [
      { model: "PAN-INV-1.5", brand: brandIds[0], btu: 18000, type: "Split", price: 145000 },
      { model: "DAI-STD-1.0", brand: brandIds[1], btu: 12000, type: "Split", price: 95000 },
      { model: "MIT-INV-2.0", brand: brandIds[2], btu: 24000, type: "Cassette", price: 210000 },
    ];

    for (const p of products) {
      await ProductService.saveProduct({
        modelNumber: p.model,
        brandId: p.brand.id,
        brandName: p.brand.name,
        btu: p.btu,
        type: p.type as ACType,
        inverter: "Inverter",
        price: p.price,
        stock: 5 + Math.floor(Math.random() * 15),
        serialNumbers: Array.from({ length: 5 }, (_, i) => `SN-${p.model}-${1000 + i}`)
      });
    }

    // 4. Seed Maintenance (for the first customer)
    if (customersForRelationships.length > 0) {
       await MaintenanceService.saveMaintenanceRecord({
         customerId: customersForRelationships[0].id,
         customerName: customersForRelationships[0].name,
         serialNumber: "SN-PAN-INV-1.5-1000",
         lastServiceDate: Date.now(),
         nextServiceDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
         status: "Scheduled",
         technicianName: "Kamal Perera",
         notes: "First service cycle after installation."
       });
    }

    console.log("Seed complete!");
  }
}

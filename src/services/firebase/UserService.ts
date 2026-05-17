import { db } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { User } from "firebase/auth";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  roles: string[];
  lastLogin: any;
  createdAt: any;
}

export class UserService {
  private static COLLECTION = "users";

  /**
   * Syncs an authenticated user with the Firestore 'users' collection.
   * Creates the document if it doesn't exist, otherwise updates metadata.
   */
  static async syncUser(user: User): Promise<void> {
    const userRef = doc(db, this.COLLECTION, user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // First-time signup logic
      const newUser: AppUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        roles: ["salesman"], // Default role is now salesman
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };
      await setDoc(userRef, newUser);
    } else {
      // Update existing user metadata
      await setDoc(userRef, {
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
      }, { merge: true });
    }
  }

  /**
   * Fetch full user data from Firestore
   */
  static async getUserData(uid: string): Promise<AppUser | null> {
    const userRef = doc(db, this.COLLECTION, uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data() as AppUser;
    }
    return null;
  }
}

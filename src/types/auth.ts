import { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  email: string;
  name: string;
  photoURL: string;
  createdAt: any; // Use 'any' to accommodate FieldValue
  lastLogin: any; // Use 'any' to accommodate FieldValue
  uid: string;
}

export interface AuthContextType {
    user: FirebaseUser | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
    loading: boolean;
  }
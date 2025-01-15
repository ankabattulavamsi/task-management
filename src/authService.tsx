import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

// Sign in with Google using a pop-up
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:------ ", result.user);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error: ", error);
    return null;
  }
};

// Sign out the user
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign-Out Error: ", error);
  }
};

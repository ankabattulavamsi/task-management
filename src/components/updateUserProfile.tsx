import { updateProfile, User } from "firebase/auth";

// Update user profile
export const updateUserProfile = async (
  user: User,
  displayName: string,
  photoURL: string
): Promise<void> => {
  try {
    await updateProfile(user, { displayName, photoURL });
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Profile Update Error: ", error);
  }
};

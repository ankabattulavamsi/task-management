import React from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../authService";

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null; // No user logged in, nothing to display.

  return (
    <div>
      <img
        src={user.photoURL || ""}
        alt={user.displayName || "User"}
        style={{ width: 50, borderRadius: "50%" }}
      />
      <h2>{user.displayName}</h2>
      <p>{user.email}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
};

export default UserProfile;

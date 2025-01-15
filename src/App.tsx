import React from "react";
import { useAuth } from "./context/AuthContext";
import UserProfile from "./components/UserProfile";
import TaskBuddyLogin from "./components/Login/TaskBuddyLogin";

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return <div>{!user ? <TaskBuddyLogin /> : <UserProfile />}</div>;
};

export default App;

import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import UserProfile from "./components/TaskBuddy/UserProfile";
import TaskBuddyLogin from "./components/Login/TaskBuddyLogin";
import { Task, User } from "./components/TaskBuddy/types";

const App: React.FC = () => {
  const [view, setView] = useState<"list" | "board">("list");
  const [tasks, setTasks] = useState<Task[]>([]);

  const currentUser: User = {
    id: "1",
    name: "Aravind",
    avatar: "/api/placeholder/40/40",
  };
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-red">
      {!user ? (
        <TaskBuddyLogin />
      ) : (
        <UserProfile view={view} setView={setView} />
      )}
    </div>
  );
};

export default App;

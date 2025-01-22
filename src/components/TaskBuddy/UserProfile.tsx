import React, { useState } from "react";
import TaskBoard from "./TaskBoard";
import TaskList from "./TaskList";
// import { User, Task } from "./types";
import { useAuth } from "../../context/AuthContext";
import TaskManager from "./TaskManager";
import { AiOutlineSearch } from "react-icons/ai";

type Task = {
  id: string;
  name: string;
  category: string;
  dueDate?: Date;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
};

type User = {
  id: string;
  name: string;
  avatar: string;
};

type LayoutProps = {
  view: "list" | "board";
  setView: (view: "list" | "board") => void;
};

const UserProfile = ({ view, setView }: LayoutProps) => {
  // const [view, setView] = useState<"list" | "board">("list");
  // const [tasks, setTasks] = useState<Task[]>([]);
  // const { user } = useAuth();
  const { user } = useAuth();

  const currentUser: User = {
    id: "1",
    name: "Aravind",
    avatar: "/api/placeholder/40/40",
  };

  if (!user) return null; // No user logged in, nothing to display.

  return (
    <div className="min-h-screen bg-white">
      {/* Main Navbar */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-medium">TaskBuddy</h1>
            <div className="flex items-center space-x-2">
              <img
                src={"/api/placeholder/40/40"}
                alt={"vamsi"}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-700">vamsi</span>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <nav className="flex border-b">
              <button
                className={`px-4 py-2 text-sm ${
                  view === "list"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setView("list")}
              >
                List
              </button>
              <button
                className={`px-4 py-2 text-sm ${
                  view === "board"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setView("board")}
              >
                Board
              </button>
            </nav>
          </div>
          <button className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50">
            Logout
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Filter by:</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option>Category</option>
                <option>Work</option>
                <option>Personal</option>
              </select>
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option>Due Date</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-64 pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <AiOutlineSearch className="absolute w-5 h-5 right-3 top-2.5 text-gray-400" />
            </div>
            <button className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700">
              ADD TASK
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {view === "list" ? <TaskManager /> : <TaskBoard tasks={[]} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

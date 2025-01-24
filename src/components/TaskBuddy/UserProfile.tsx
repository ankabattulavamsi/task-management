import React, { useState, useEffect } from "react";
import TaskBoard from "./TaskBoard";
import TaskManager from "./TaskManager";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineSearch } from "react-icons/ai";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Task } from "./types";
import { logout } from "../../authService";
import CreateTaskModal from "./CreateTaskModal";

const UserProfile = () => {
  const [view, setView] = useState("list");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const taskList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            dueDate: data.dueDate || "",
            category: data.category || "",
            status: data.status || "",
            attachments: data.attachments || [],
            ...data,
          };
        });
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskCreated = (task: Task) => {
    // Add the newly created task to the tasks state
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = !filterCategory || task.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDueDate = true;
    if (filterDueDate) {
      const today = new Date();
      const taskDate = new Date(task.dueDate);

      switch (filterDueDate) {
        case "today":
          matchesDueDate = taskDate.toDateString() === today.toDateString();
          break;
        case "week":
          const weekFromNow = new Date(today.setDate(today.getDate() + 7));
          matchesDueDate = taskDate <= weekFromNow;
          break;
        case "month":
          const monthFromNow = new Date(today.setMonth(today.getMonth() + 1));
          matchesDueDate = taskDate <= monthFromNow;
          break;
      }
    }

    return matchesCategory && matchesSearch && matchesDueDate;
  });

  console.log("user", user);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Navbar */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-medium">TaskBuddy</h1>
            <div className="flex items-center space-x-2">
              <img
                src={user.photoURL || ""}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-700">
                {user.displayName || "User"}
              </span>
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
          <button
            className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Filter by:</span>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Category</option>
                <option value="WORK">Work</option>
                <option value="PERSONAL">Personal</option>
              </select>
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={filterDueDate}
                onChange={(e) => setFilterDueDate(e.target.value)}
              >
                <option value="">Due Date</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <AiOutlineSearch className="absolute w-5 h-5 right-3 top-2.5 text-gray-400" />
            </div>
            <button
              className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
              onClick={() => setShowCreateTaskModal(true)}
            >
              ADD TASK
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {view === "list" ? (
            <TaskManager tasks={filteredTasks} setTasks={setTasks} />
          ) : (
            <TaskBoard tasks={filteredTasks} setTasks={setTasks} />
          )}
        </div>
      </div>
      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default UserProfile;

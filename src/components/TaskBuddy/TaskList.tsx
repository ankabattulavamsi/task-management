import React, { useState, useEffect } from "react";
import { FaGripVertical } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";

interface Task {
  id: number;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  completed: boolean;
  dueDate: string;
  category: "Work" | "Personal";
}

const TaskList: React.FC = () => {
  const initialTasks: Task[] = [
    {
      id: 1,
      title: "Complete project documentation",
      status: "TODO",
      completed: false,
      dueDate: "2024-01-20",
      category: "Work",
    },
    {
      id: 2,
      title: "Review pull requests",
      status: "IN_PROGRESS",
      completed: false,
      dueDate: "2024-01-19",
      category: "Work",
    },
    {
      id: 3,
      title: "Buy groceries",
      status: "COMPLETED",
      completed: true,
      dueDate: "2024-01-18",
      category: "Personal",
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    setDragOverSection(status);
  };

  const handleDrop = (targetStatus: Task["status"]) => {
    if (draggedTask) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === draggedTask.id) {
          // Update completed status based on target section
          const completed = targetStatus === "COMPLETED";
          return {
            ...task,
            status: targetStatus,
            completed,
          };
        }
        return task;
      });
      setTasks(updatedTasks);
      setDraggedTask(null);
      setDragOverSection(null);
    }
  };

  const handleCheckboxChange = (taskId: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const completed = !task.completed;
          return {
            ...task,
            completed,
            status: completed ? "COMPLETED" : "TODO",
          };
        }
        return task;
      })
    );
  };

  const TaskSection: React.FC<{
    title: string;
    status: Task["status"];
    bgColor: string;
  }> = ({ title, status, bgColor }) => (
    <div
      className={`rounded-lg p-4 mb-4 transition-all duration-300 ${bgColor} ${
        dragOverSection === status
          ? "ring-2 ring-purple-500 transform scale-[1.01] shadow-lg"
          : ""
      }`}
      onDragOver={(e) => handleDragOver(e, status)}
      onDragLeave={() => setDragOverSection(null)}
      onDrop={() => handleDrop(status)}
    >
      <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
        {title}
        <span className="text-sm bg-white/50 px-2 py-1 rounded">
          {tasks.filter((task) => task.status === status).length} tasks
        </span>
      </h2>

      <div className="space-y-2">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <div
              key={task.id}
              className="group bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <FaGripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <button
                  onClick={() => handleCheckboxChange(task.id)}
                  className={`w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center ${
                    task.completed
                      ? "bg-purple-600 border-purple-600"
                      : "border-gray-300 hover:border-purple-400"
                  }`}
                >
                  {task.completed && (
                    <MdOutlineRadioButtonUnchecked className="w-3 h-3 text-white" />
                  )}
                </button>

                <div className="flex-1">
                  <p
                    className={`transition-all duration-200 ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.category === "Work"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {task.category}
                    </span>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FiMoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid gap-4">
        <TaskSection title="To Do" status="TODO" bgColor="bg-purple-50" />
        <TaskSection
          title="In Progress"
          status="IN_PROGRESS"
          bgColor="bg-blue-50"
        />
        <TaskSection
          title="Completed"
          status="COMPLETED"
          bgColor="bg-green-50"
        />
      </div>
    </div>
  );
};

export default TaskList;

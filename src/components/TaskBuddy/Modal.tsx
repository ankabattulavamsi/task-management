import React, { useState, useEffect } from "react";
import { Task } from "./types";

interface ModalProps {
  isOpen: boolean;
  type: "edit" | "delete" | null;
  task: Task | null;
  onClose: () => void;
  onUpdate: (updatedTask: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  type,
  task,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task && type === "edit") {
      setEditedTask({
        title: task.title,
        dueDate: task.dueDate,
        category: task.category,
        status: task.status,
      });
    }
  }, [task, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {type === "edit" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpdate(editedTask);
            }}
          >
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editedTask.title || ""}
                  onChange={(e) =>
                    setEditedTask((prev: any) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editedTask.dueDate || ""}
                  onChange={(e) =>
                    setEditedTask((prev: any) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={editedTask.category || ""}
                  onChange={(e) =>
                    setEditedTask((prev: any) => ({
                      ...prev,
                      category: e.target.value as Task["category"],
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="WORK">Work</option>
                  <option value="PERSONAL">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={editedTask.status || ""}
                  onChange={(e) =>
                    setEditedTask((prev: any) => ({
                      ...prev,
                      status: e.target.value as Task["status"],
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="TO-DO">Todo</option>
                  <option value="IN-PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : type === "delete" ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Delete Task</h2>
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(task?.id || "")}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

import React from "react";
import {
  AiOutlineCalendar,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import { Task } from "./types";

interface TaskItemProps {
  task: Task;
  provided: any;
  onStatusChange: (id: string) => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  provided,
  onStatusChange,
  onEditClick,
  onDeleteClick,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const today = new Date();
      // Compare the year, month, and day
      if (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      ) {
        return "Today";
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="grid grid-cols-12 gap-4 items-center p-3 bg-gray-50 border-t"
    >
      <div className="col-span-4 flex items-center">
        <input
          type="checkbox"
          checked={task.status === "COMPLETED"}
          onChange={() => onStatusChange(task.id)}
          className="mr-2"
        />
        <span className={task.status === "COMPLETED" ? "line-through" : ""}>
          {task.title}
        </span>
      </div>

      <div className="col-span-2 flex items-center text-sm text-gray-500">
        {/* <AiOutlineCalendar className="inline mr-1" /> */}
        <span>{formatDate(task.dueDate)}</span>
      </div>

      <div className="col-span-2">
        <span className="px-2 py-1 text-sm rounded bg-gray-100">
          {task.status}
        </span>
      </div>

      <div className="px-2 py-1 text-sm rounded col-span-2">
        {task.category}
      </div>

      <div className="col-span-2 flex gap-5 justify-end mr-6">
        <button
          onClick={() => onEditClick(task)}
          className="text-blue-500 hover:text-blue-700"
        >
          <AiOutlineEdit size={18} />
        </button>
        <button
          onClick={() => onDeleteClick(task)}
          className="text-red-500 hover:text-red-700"
        >
          <AiOutlineDelete size={18} />
        </button>
      </div>
    </div>
  );
};

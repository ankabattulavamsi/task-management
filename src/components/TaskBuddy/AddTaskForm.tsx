import React, { useState } from "react";
import { AiOutlineCalendar, AiOutlinePlusCircle } from "react-icons/ai";
import { BsArrowReturnLeft } from "react-icons/bs";
import { Task } from "./types";

interface AddTaskFormProps {
  task: Omit<Task, "id">;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  task,
  onInputChange,
  onSubmit,
  onCancel,
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const statusOptions = ["TO-DO", "IN-PROGRESS", "COMPLETED"];
  const categoryOptions = ["WORK", "PERSONAL"];

  const handleStatusSelect = (status: string) => {
    onInputChange({
      target: { name: "status", value: status },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowStatusDropdown(false);
  };

  const handleCategorySelect = (category: string) => {
    onInputChange({
      target: { name: "category", value: category },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowCategoryDropdown(false);
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 bg-gray-50">
      <div className="grid grid-cols-12 gap-4 items-center p-3">
        {/* Task Title Input */}
        <div className="col-span-4">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={task.title}
            onChange={onInputChange}
            className="w-full px-3 py-2 bg-transparent border-none focus:ring-0 focus:outline-none"
            autoFocus
          />
        </div>

        {/* Date Picker */}
        <div className="relative col-span-2 flex items-center text-sm -ml-4">
          <input
            name="dueDate"
            type="date"
            value={task.dueDate}
            onChange={onInputChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-8 h-8"
          />
          <div className="rounded-full border flex  justify-center hover:bg-gray-200 cursor-pointer  gap-2 px-4 py-2">
            <AiOutlineCalendar size={20} />
            <span className="text-sm">Add Date</span>
          </div>
        </div>
        {/* Status Dropdown */}
        <div className="col-span-3 relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-gray-200"
          >
            <AiOutlinePlusCircle size={20} />
            <span className="text-sm">{task.status || "Status"}</span>
          </button>
          {showStatusDropdown && (
            <div className="absolute mt-1 w-40 bg-white rounded-lg shadow-lg z-50 border">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="col-span-2 relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-gray-200"
          >
            <AiOutlinePlusCircle size={20} />
            <span className="text-sm">{task.category || "Category"}</span>
          </button>
          {showCategoryDropdown && (
            <div className="absolute mt-1 w-40 bg-white rounded-lg shadow-lg z-50 border">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 ml-6 mt-4">
        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800 flex items-center gap-2"
        >
          ADD
          <BsArrowReturnLeft size={16} />
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-full hover:bg-gray-100"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

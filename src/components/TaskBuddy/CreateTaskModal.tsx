import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Task } from "./types";
import {
  AiOutlineBars,
  AiOutlineClose,
  AiOutlineCloudUpload,
  AiOutlineOrderedList,
} from "react-icons/ai";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const categoryOptions: Array<Task["category"]> = ["WORK", "PERSONAL"];

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    dueDate: "",
    category: "WORK",
    status: "TO-DO",
    attachments: [],
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachments(Array.from(files));
      setNewTask((prev) => ({ ...prev, attachments: Array.from(files) }));
    }
  };

  const handleCreateTask = async () => {
    if (
      !newTask.title ||
      !newTask.description ||
      !newTask.dueDate ||
      !newTask.status ||
      !newTask.category
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      const createdTask: Task = { ...newTask, id: docRef.id };
      onTaskCreated(createdTask);
      onClose();
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        category: "WORK",
        status: "TO-DO",
        attachments: [],
      });
      setAttachments([]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const onCloseModal = () => {
    onClose();
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      category: "WORK",
      status: "TO-DO",
      attachments: [],
    });
    setAttachments([]);
  };

  if (!isOpen) return null;

  function handleCategorySelect(category: Task["category"]): void {
    setNewTask((prev) => ({ ...prev, category }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full h-full">
      <div className="bg-white rounded-lg  w-full max-w-2xl">
        <div className="flex justify-between items-center border-b mb-2 p-6">
          <p className="text-xl font-semibold  text-[#2F2F2F]">Create Task</p>
          <button className="" onClick={onCloseModal}>
            <AiOutlineClose size={22} color="#2F2F2F" />
          </button>
        </div>
        <div className="space-y-6 p-4">
          <div className="">
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={newTask.title}
              onChange={handleInputChange}
              className="mt-1 block w-full outline-none bg-gray-50 hover:bg-gray-100 border-2 rounded-lg px-4 py-2  shadow-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              required
            />
          </div>
          {/* Task Description */}
          <div className="mt-1 block w-full outline-none bg-gray-50 hover:bg-gray-100 border-2 rounded-xl px-4 py-2  shadow-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500">
            <textarea
              value={newTask.description}
              onChange={handleInputChange}
              rows={4}
              name="description"
              placeholder="Write your description here..."
              className="w-full h-20 resize-none bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 text-sm"
            ></textarea>

            {/* Formatting Toolbar */}
            <div className="flex justify-between items-center mt-3 text-gray-500 text-sm">
              {/* Left: Formatting options */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="hover:text-black focus:outline-none"
                  title="Bold"
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className="hover:text-black focus:outline-none"
                  title="Italic"
                >
                  <em>I</em>
                </button>
                <span className="border border-gray-400"></span>
                <button
                  type="button"
                  className="hover:text-black focus:outline-none"
                  title="Align Left"
                >
                  <AiOutlineOrderedList />
                </button>
                <button
                  type="button"
                  className="hover:text-black focus:outline-none"
                  title="Align Justify"
                >
                  <AiOutlineBars />
                </button>
              </div>

              {/* Right: Character count */}
              <div className="text-gray-400">
                {newTask.description.length}/300 characters
              </div>
            </div>
          </div>

          {/* Task Category, Due Date, and Status */}
          <div className="flex items-center grid grid-cols-3 gap-4">
            <div className="">
              <label className="block text-sm font-medium text-[#00000099] mb-3">
                Task Category *
              </label>
              <div className="flex items-center gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-center px-4 py-2 rounded-full border text-sm hover:bg-gray-50"
                  >
                    {category.toLocaleLowerCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="-mt-2">
              <label className="block text-sm font-medium text-[#00000099] mb-4">
                Due on *
              </label>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="block w-full rounded-lg bg-gray-100 focus:bg-gray-100 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-2 py-1 border"
              />
            </div>
            <div className="-mt-2">
              <label className="block text-sm font-medium text-[#00000099] mb-2">
                Task Status *
              </label>
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="mt-3 block w-full rounded-lg bg-gray-100 focus:bg-gray-100 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2 border"
              >
                <option value="TO-DO">To Do</option>
                <option value="IN-PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Attachments */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center px-4 py-4 space-y-2">
                <p className=" text-sm text-gray-500">
                  <span className="font-semibold">Drop your files here</span> or
                  <span className="text-blue-500 underline ml-2">Update</span>
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="flex items-center justify-center w-full">
            {attachments.length > 0 && (
              <div className="flex space-x-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md flex items-center space-x-2"
                  >
                    <AiOutlineCloudUpload size={16} />
                    <span className="text-sm font-medium truncate">
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3 border-t p-4 bg-gray-100 hover:bg-gray-150">
          <button
            type="button"
            onClick={onCloseModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateTask}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;

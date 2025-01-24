import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { MoreHorizontal } from "lucide-react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Task } from "./types";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { Modal } from "./Modal";

interface TaskManagerProps {
  tasks: Task[];

  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskBoard: React.FC<TaskManagerProps> = ({ tasks, setTasks }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const columns = [
    {
      id: "TO-DO",
      label: "TO-DO",
      bgColor: "bg-pink-100",
      textColor: "text-pink-800",
    },
    {
      id: "IN-PROGRESS",
      label: "IN-PROGRESS",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      id: "COMPLETED",
      label: "COMPLETED",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    },
  ];

  interface DragResult {
    destination: {
      droppableId: string;
      index: number;
    } | null;
    source: {
      droppableId: string;
      index: number;
    };
    draggableId: string;
    type: string;
  }

  const handleDragEnd = async (result: DragResult): Promise<void> => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    try {
      // Update in Firestore
      const taskRef = doc(db, "tasks", draggableId);
      await updateDoc(taskRef, { status: destination.droppableId });

      // Update local state
      const updatedTasks: any = tasks.map((task) =>
        task.id === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Partial<Task>) => {
    if (!selectedTask) return;

    try {
      const taskRef = doc(db, "tasks", selectedTask.id);
      await updateDoc(taskRef, updatedTask);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id ? { ...task, ...updatedTask } : task
        )
      );
      setShowModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category?.toUpperCase()) {
      case "WORK":
        return "bg-purple-100 text-purple-800";
      case "PERSONAL":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div
                  className={`${column.bgColor} ${column.textColor} inline-block px-3 py-1 rounded-full text-sm font-medium mb-4`}
                >
                  {column.label}
                </div>

                <div className="space-y-4">
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded-lg shadow-sm p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">
                                {task.title}
                              </h3>
                              <button className="text-gray-400 hover:text-gray-600">
                                <MdOutlineMoreHoriz size={16} />
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(
                                  task.category
                                )}`}
                              >
                                {task.category}
                              </span>
                              {task.dueDate && (
                                <span className="text-xs text-gray-500">
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>

                {tasks.filter((task) => task.status === column.id).length ===
                  0 && (
                  <div className="text-center py-8 text-gray-500">No tasks</div>
                )}
              </div>
            )}
          </Droppable>
        ))}
      </div>

      {selectedTask && (
        <Modal
          isOpen={showModal}
          task={selectedTask}
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          type={null}
        />
      )}
    </DragDropContext>
  );
};

export default TaskBoard;

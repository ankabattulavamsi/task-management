import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import {
  AiOutlineDown,
  AiOutlineRight,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { Task } from "./types";
import { TaskItem } from "./TaskItem";

interface TaskSectionProps {
  title: string;
  status: Task["status"];
  show: boolean;
  onToggle: () => void;
  tasks: Task[];
  showAddTask?: boolean;
  onAddTaskClick?: () => void;
  onStatusChange: (id: string) => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (task: Task) => void;
  children?: React.ReactNode;
  droppableId: string;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  status,
  show,
  onToggle,
  tasks,
  showAddTask,
  onAddTaskClick,
  onStatusChange,
  onEditClick,
  onDeleteClick,
  children,
  droppableId,
}) => {
  const getBgColor = () => {
    switch (status) {
      case "TO-DO":
        return "bg-pink-100";
      case "IN-PROGRESS":
        return "bg-blue-100";
      case "COMPLETED":
        return "bg-green-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div
        className={`flex items-center justify-between p-4 cursor-pointer rounded-t-lg ${getBgColor()}`}
        onClick={onToggle}
      >
        <h2 className="text-lg font-semibold">
          {title} ({tasks.length})
        </h2>
        {show ? <AiOutlineDown size={20} /> : <AiOutlineRight size={20} />}
      </div>

      {children}

      {status === "TO-DO" && !showAddTask && (
        <div className="flex items-center justify-between bg-gray-100 hover:bg-gray-50">
          <button
            className="w-full text-left p-2 text-purple-600 rounded flex items-center gap-2"
            onClick={onAddTaskClick}
          >
            <AiOutlinePlusCircle size={20} />
            ADD TASK
          </button>
        </div>
      )}

      {show && (
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-gray-50"
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(dragProvided) => (
                    <TaskItem
                      task={task}
                      provided={dragProvided}
                      onStatusChange={onStatusChange}
                      onEditClick={onEditClick}
                      onDeleteClick={onDeleteClick}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

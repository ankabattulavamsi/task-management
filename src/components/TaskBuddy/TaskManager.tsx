// TaskManager.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { db } from "../../firebase";
import { Task, Modal as ModalType } from "./types";
import { AddTaskForm } from "./AddTaskForm";
import { TaskSection } from "./TaskSection";
import { Modal } from "./Modal";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTodo, setShowTodo] = useState<boolean>(true);
  const [showInProgress, setShowInProgress] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [modal, setModal] = useState<ModalType>({
    isOpen: false,
    type: null,
    task: null,
  });
  const [showAddTask, setShowAddTask] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    dueDate: "",
    category: "WORK",
    status: "TO-DO",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasks"));
        const taskList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskStatusChange = async (taskId: string) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (!taskToUpdate) return;

    const newStatus =
      taskToUpdate.status === "COMPLETED" ? "TO-DO" : "COMPLETED";

    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    console.log(result);
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Find the dragged task
    const draggedTask = tasks.find((task) => task.id === draggableId);
    if (!draggedTask) {
      console.error("Dragged task not found.");
      return;
    }

    // Update the status based on the new droppableId
    const newStatus = destination.droppableId as Task["status"];

    try {
      // Update in Firestore
      const taskRef = doc(db, "tasks", draggableId);
      await updateDoc(taskRef, { status: newStatus });

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggableId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task position:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    console.log("Task before adding:", newTask);

    if (
      !newTask.title ||
      !newTask.dueDate ||
      !newTask.status ||
      !newTask.category
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      const addedTask = { ...newTask, id: docRef.id };
      setTasks((prev) => [...prev, addedTask]);

      // Reset form
      setNewTask({
        title: "",
        dueDate: "",
        category: "WORK",
        status: "TO-DO",
      });
      setShowAddTask(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Partial<Task>) => {
    if (!modal.task) return;

    try {
      const taskRef = doc(db, "tasks", modal.task.id);
      await updateDoc(taskRef, updatedTask);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === modal.task?.id ? { ...task, ...updatedTask } : task
        )
      );

      setModal({ isOpen: false, type: null, task: null });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async () => {
    if (!modal.task) return;

    try {
      await deleteDoc(doc(db, "tasks", modal.task.id));
      setTasks((prev) => prev.filter((task) => task.id !== modal.task?.id));
      setModal({ isOpen: false, type: null, task: null });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-4 max-w-5xl mx-auto">
        <div className="space-y-4">
          <Droppable droppableId="TO-DO">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-[50px]"
              >
                <TaskSection
                  title="Todo"
                  status="TO-DO"
                  show={showTodo}
                  onToggle={() => setShowTodo(!showTodo)}
                  tasks={tasks.filter((task) => task.status === "TO-DO")}
                  showAddTask={showAddTask}
                  onAddTaskClick={() => setShowAddTask(true)}
                  onStatusChange={handleTaskStatusChange}
                  onEditClick={(task) =>
                    setModal({ isOpen: true, type: "edit", task })
                  }
                  onDeleteClick={(task) =>
                    setModal({ isOpen: true, type: "delete", task })
                  }
                  droppableId="TO-DO"
                >
                  {showAddTask && (
                    <AddTaskForm
                      task={newTask}
                      onInputChange={(e) => {
                        const { name, value } = e.target;
                        setNewTask((prev) => ({ ...prev, [name]: value }));
                      }}
                      onSubmit={handleAddTask}
                      onCancel={() => {
                        setShowAddTask(false);
                        setNewTask({
                          title: "",
                          dueDate: "",
                          category: "WORK",
                          status: "TO-DO",
                        });
                      }}
                    />
                  )}
                </TaskSection>
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="IN-PROGRESS">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-[50px]"
              >
                <TaskSection
                  title="In Progress"
                  status="IN-PROGRESS"
                  show={showInProgress}
                  onToggle={() => setShowInProgress(!showInProgress)}
                  tasks={tasks.filter((task) => task.status === "IN-PROGRESS")}
                  onStatusChange={handleTaskStatusChange}
                  onEditClick={(task) =>
                    setModal({ isOpen: true, type: "edit", task })
                  }
                  onDeleteClick={(task) =>
                    setModal({ isOpen: true, type: "delete", task })
                  }
                  droppableId="IN-PROGRESS"
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="COMPLETED">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="min-h-[50px]"
              >
                <TaskSection
                  title="Completed"
                  status="COMPLETED"
                  show={showCompleted}
                  onToggle={() => setShowCompleted(!showCompleted)}
                  tasks={tasks.filter((task) => task.status === "COMPLETED")}
                  onStatusChange={handleTaskStatusChange}
                  onEditClick={(task) =>
                    setModal({ isOpen: true, type: "edit", task })
                  }
                  onDeleteClick={(task) =>
                    setModal({ isOpen: true, type: "delete", task })
                  }
                  droppableId="COMPLETED"
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <Modal
          isOpen={modal.isOpen}
          type={modal.type}
          task={modal.task}
          onClose={() => setModal({ isOpen: false, type: null, task: null })}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </DragDropContext>
  );
};

export default TaskManager;

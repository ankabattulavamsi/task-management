import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  AiOutlineCalendar,
  AiOutlineDelete,
  AiOutlineDown,
  AiOutlineRight,
  AiOutlineEdit,
  AiOutlineClose,
  AiOutlinePlusCircle,
  AiOutlinePlus,
  AiFillCalendar,
} from "react-icons/ai";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  category: "WORK" | "PERSONAL";
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
}

interface Modal {
  isOpen: boolean;
  type: "edit" | "delete" | null;
  task: Task | null;
}

interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTodo, setShowTodo] = useState<boolean>(true);
  const [showInProgress, setShowInProgress] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [modal, setModal] = useState<Modal>({
    isOpen: false,
    type: null,
    task: null,
  });
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    dueDate: "",
    category: "WORK",
    status: "TO-DO",
  });
  const [showAddTask, setShowAddTask] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const taskList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(taskList);
    };
    fetchTasks();
  }, []);

  const handleTaskStatusChange = (taskId: any) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus =
            task.status === "COMPLETED"
              ? Number(task.id) <= 3
                ? "TO-DO"
                : Number(task.id) <= 6
                ? "IN-PROGRESS"
                : "TO-DO"
              : "COMPLETED";
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const updatedTask = {
      ...task,
      status: destination.droppableId as Task["status"],
    };

    try {
      await updateDoc(doc(db, "tasks", draggableId), { ...updatedTask });
      setTasks((prev) =>
        prev.map((t) => (t.id === draggableId ? updatedTask : t))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleInputChange = (e: InputChangeEvent) => {
    const value = e.target.value;
    setNewTask((prev) => ({
      ...prev,
      title: value,
    }));
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      const newTaskWithId = {
        ...newTask,
        id: docRef.id,
      };

      setTasks((prev) => [...prev, newTaskWithId]);
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

  const openModal = (type: "edit" | "delete", task: Task) => {
    setModal({ isOpen: true, type, task });
    if (type === "edit") {
      setEditTask(task);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null, task: null });
    setEditTask(null);
  };

  const handleUpdateTask = async () => {
    if (!editTask || !modal.task) return;

    try {
      await updateDoc(doc(db, "tasks", modal.task.id), { ...editTask });
      setTasks((prev) =>
        prev.map((t) => (t.id === modal.task?.id ? editTask : t))
      );
      closeModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async () => {
    if (!modal.task) return;

    try {
      await deleteDoc(doc(db, "tasks", modal.task.id));
      setTasks((prev) => prev.filter((t) => t.id !== modal.task?.id));
      closeModal();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const TaskSection: React.FC<{
    title: string;
    status: Task["status"];
    show: boolean;
    onToggle: () => void;
    tasks: Task[];
  }> = ({ title, status, show, onToggle, tasks }) => (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div
        className={`flex items-center justify-between p-4 cursor-pointer rounded-t-lg ${
          status === "TO-DO"
            ? "bg-pink-100"
            : status === "IN-PROGRESS"
            ? "bg-blue-100"
            : "bg-green-100"
        }`}
        onClick={onToggle}
      >
        <h2 className="text-lg font-semibold">
          {title} ({tasks.length})
        </h2>
        {show ? <AiOutlineDown size={20} /> : <AiOutlineRight size={20} />}
      </div>

      {/* Add Task Form */}

      {status === "TO-DO" && showAddTask && (
        // <div className="bg-white rounded-lg shadow-md mb-4 p-4">
        //   <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 ">
        //     {" "}
        //     <AiOutlinePlus size={20} />
        //     Add Task
        //   </h2>
        //   <div className="flex gap-4">
        //     <input
        //       type="text"
        //       placeholder="Task title"
        //       value={newTask.title}
        //       onChange={handleInputChange}
        //       autoFocus
        //       className="flex-1 px-3 py-2 border rounded"
        //     />
        //     <input
        //       type="date"
        //       value={newTask.dueDate}
        //       onChange={(e) =>
        //         setNewTask({ ...newTask, dueDate: e.target.value })
        //       }
        //       className="px-3 py-2 border rounded"
        //     />
        //     <select
        //       value={newTask.category}
        //       onChange={(e) =>
        //         setNewTask({
        //           ...newTask,
        //           category: e.target.value as Task["category"],
        //         })
        //       }
        //       className="px-3 py-2 border rounded"
        //     >
        //       <option value="TO-DO">TO-DO</option>
        //       <option value="IN-PROGRESS">IN-PROGRESS</option>
        //       <option value="COMPLETED">COMPLETED</option>
        //     </select>
        //     <select
        //       value={newTask.category}
        //       onChange={(e) =>
        //         setNewTask({
        //           ...newTask,
        //           category: e.target.value as Task["category"],
        //         })
        //       }
        //       className="px-3 py-2 border rounded"
        //     >
        //       <option value="WORK">Work</option>
        //       <option value="PERSONAL">Personal</option>
        //     </select>
        //     <button
        //       onClick={handleAddTask}
        //       className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        //     >
        //       Add Task
        //     </button>
        //     <button
        //       className="px-4 py-2 border rounded hover:bg-gray-100"
        //       onClick={() => {
        //         setShowAddTask(false);
        //         setNewTask({
        //           title: "",
        //           dueDate: "",
        //           category: "WORK",
        //           status: "TO-DO",
        //         });
        //       }}
        //     >
        //       CANCEL
        //     </button>
        //   </div>
        // </div>
        <div className="p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="absolute inset-0 opacity-0 cursor-pointer w-8 h-8"
              />
              <div className="rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer p-2">
                <AiFillCalendar size={20} />
                <h1>Add Date</h1>
              </div>
            </div>

            {/* Status Dropdown */}
            {/* <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
              {showStatusDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                  {["TO-DO", "IN-PROGRESS", "COMPLETED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setTask({ ...task, status });
                        setShowStatusDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div> */}

            {/* Category Dropdown */}
            {/* <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
              {showCategoryDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                  {["WORK", "PERSONAL"].map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setTask({ ...task, category });
                        setShowCategoryDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div> */}
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              ADD
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              CANCEL
            </button>
          </div> */}
        </div>
      )}

      {status === "TO-DO" && !showAddTask && (
        <div className="flex items-center justify-between  bg-gray-100 hover:bg-gray-50">
          <button
            className="w-full text-left p-2 text-purple-600 rounded flex items-center gap-2 "
            onClick={() => setShowAddTask(true)}
          >
            <AiOutlinePlusCircle size={20} />
            ADD TASK
          </button>
        </div>
      )}

      {show && (
        <Droppable droppableId={status}>
          {(provided: any) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="bg-gray-50"
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between p-3  bg-gray-50 border-t w-full"
                    >
                      <div className="flex items-center w-4/12">
                        <input
                          type="checkbox"
                          checked={task.status === "COMPLETED"}
                          readOnly
                          className="mr-2"
                          onChange={() => handleTaskStatusChange(task.id)}
                        />
                        <span
                          className={
                            status === "COMPLETED" ? "line-through" : ""
                          }
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 align-self-start">
                        <AiOutlineCalendar className="inline mr-1" />
                        {task.dueDate}
                      </div>
                      <div className="col-span-3">
                        <span className="px-2 py-1 text-sm rounded bg-gray-100">
                          {task.status}
                        </span>
                      </div>
                      <div
                        className={`px-2 py-1 text-sm rounded ${
                          task.category === "WORK"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        {task.category}
                      </div>

                      {/* <div className="col-span-1 text-right">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <AiOutlineEllipsis size={16} />
                        </button>
                      </div> */}
                      <div className="flex gap-4">
                        <button
                          onClick={() => openModal("edit", task)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <AiOutlineEdit size={18} />
                        </button>
                        <button
                          onClick={() => openModal("delete", task)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <AiOutlineDelete size={18} />
                        </button>
                      </div>
                      {/* <button
                        onClick={() => openModal("edit", task)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <AiOutlineEdit size={18} />
                      </button>
                      <button
                        onClick={() => openModal("delete", task)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <AiOutlineDelete size={18} />
                      </button> */}
                    </div>
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-4 max-w-4xl mx-auto">
        {/* Task Sections */}
        <TaskSection
          title="Todo"
          status="TO-DO"
          show={showTodo}
          onToggle={() => setShowTodo(!showTodo)}
          tasks={tasks.filter((task) => task.status === "TO-DO")}
        />

        <TaskSection
          title="In Progress"
          status="IN-PROGRESS"
          show={showInProgress}
          onToggle={() => setShowInProgress(!showInProgress)}
          tasks={tasks.filter((task) => task.status === "IN-PROGRESS")}
        />

        <TaskSection
          title="Completed"
          status="COMPLETED"
          show={showCompleted}
          onToggle={() => setShowCompleted(!showCompleted)}
          tasks={tasks.filter((task) => task.status === "COMPLETED")}
        />

        {/* Modal */}
        {modal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {modal.type === "edit" ? "Edit Task" : "Delete Task"}
                </h3>
                <button onClick={closeModal}>
                  <AiOutlineClose size={20} />
                </button>
              </div>

              {modal.type === "edit" && editTask && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTask.title}
                    onChange={(e) =>
                      setEditTask({ ...editTask, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="date"
                    value={editTask.dueDate}
                    onChange={(e) =>
                      setEditTask({ ...editTask, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                  <select
                    value={editTask.category}
                    onChange={(e) =>
                      setEditTask({
                        ...editTask,
                        category: e.target.value as Task["category"],
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="WORK">Work</option>
                    <option value="PERSONAL">Personal</option>
                  </select>
                  <select
                    value={editTask.status}
                    onChange={(e) =>
                      setEditTask({
                        ...editTask,
                        status: e.target.value as Task["status"],
                      })
                    }
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="TO-DO">To Do</option>
                    <option value="IN-PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <button
                    onClick={handleUpdateTask}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Update Task
                  </button>
                </div>
              )}

              {modal.type === "delete" && (
                <div className="space-y-4">
                  <p>Are you sure you want to delete this task?</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteTask}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default TaskManager;

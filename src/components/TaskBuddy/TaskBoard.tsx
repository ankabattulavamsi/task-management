import { Task } from "./Types";

type TaskBoardProps = {
  tasks: Task[];
};

const TaskBoard = ({ tasks }: TaskBoardProps) => {
  const columns = ["TODO", "IN_PROGRESS", "COMPLETED"] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((status) => (
        <div key={status} className="bg-gray-100 rounded-lg p-4">
          <div
            className={`
            inline-block px-3 py-1 rounded-full text-sm font-medium mb-4
            ${status === "TODO" ? "bg-pink-100 text-pink-800" : ""}
            ${status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" : ""}
            ${status === "COMPLETED" ? "bg-green-100 text-green-800" : ""}
          `}
          >
            {status}
          </div>
          <div className="space-y-4">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium text-gray-900">{task.name}</h3>
                  {task.category && (
                    <span className="text-sm text-gray-500">
                      {task.category}
                    </span>
                  )}
                </div>
              ))}
            {tasks.filter((task) => task.status === status).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {`No Tasks ${
                  status === "TODO"
                    ? "in To-Do"
                    : status === "IN_PROGRESS"
                    ? "in Progress"
                    : "Completed"
                }`}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;

// export type Task = {
//     id: string;
//     name: string;
//     category: string;
//     dueDate?: Date;
//     status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
//   };
  
  export type User = {
    id: string;
    name: string;
    avatar: string;
  };
  
export interface Task {
  id: string;
  title: string;
  dueDate: string;
  category: "WORK" | "PERSONAL";
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
}

export interface Modal {
  isOpen: boolean;
  type: "edit" | "delete" | null;
  task: Task | null;
}
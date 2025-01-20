export type Task = {
    id: string;
    name: string;
    category: string;
    dueDate?: Date;
    status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  };
  
  export type User = {
    id: string;
    name: string;
    avatar: string;
  };
  
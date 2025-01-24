
  export type User = {
    id: string;
    name: string;
    avatar: string;
  };
  

  export interface Task {

    id: string;
  
    title: string;

    description: string;
  
    dueDate: string;
  
    category: "WORK" | "PERSONAL";
  
    status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";

    attachments: File[];
  
  }
  

export interface Modal {
  isOpen: boolean;
  type: "edit" | "delete" | null;
  task: Task | null;
}

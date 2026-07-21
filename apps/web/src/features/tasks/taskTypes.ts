export type TaskCategory =
  | "Piaskraft"
  | "PrestaShop"
  | "eBay"
  | "BaseLinker"
  | "MJW"
  | "Marketing"
  | "Dokumenty"
  | "Telefon"
  | "Prywatne"
  | "Inne";

export type TaskPriority = "Niski" | "Normalny" | "Ważny" | "Pilny" | "Dzisiaj";

export type TaskStatus =
  | "Nowe"
  | "Do zrobienia"
  | "W trakcie"
  | "Czeka na sprawdzenie"
  | "Zrobione"
  | "Anulowane";
export type AssignedUser = "Admin" | "Operator" | "Oboje";

export type TaskComment = {
  id: number;
  author: AssignedUser;
  content: string;
  createdAt: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  assignedTo: AssignedUser;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  archivedAt: string | null;
  date: string;
  time?: string;
  comments: TaskComment[];
  createdBy: AssignedUser;
  createdAt: string;
  updatedAt: string;
};

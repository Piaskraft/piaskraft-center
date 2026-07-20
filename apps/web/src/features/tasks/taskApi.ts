import type {
  AssignedUser,
  Task,
  TaskCategory,
  TaskComment,
  TaskPriority,
  TaskStatus,
} from "./taskTypes";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const assignedUserFromApi = {
  ADMIN: "Admin",
  OPERATOR: "Operator",
  BOTH: "Oboje",
} as const satisfies Record<string, AssignedUser>;

const taskAuthorFromApi = {
  ADMIN: "Admin",
  OPERATOR: "Operator",
} as const satisfies Record<string, AssignedUser>;

const taskCategoryFromApi = {
  PIASKRAFT: "Piaskraft",
  PRESTASHOP: "PrestaShop",
  EBAY: "eBay",
  BASELINKER: "BaseLinker",
  MJW: "MJW",
  MARKETING: "Marketing",
  DOCUMENTS: "Dokumenty",
  PHONE: "Telefon",
  PRIVATE: "Prywatne",
  OTHER: "Inne",
} as const satisfies Record<string, TaskCategory>;

const taskPriorityFromApi = {
  LOW: "Niski",
  NORMAL: "Normalny",
  IMPORTANT: "Ważny",
  URGENT: "Pilny",
  TODAY: "Dzisiaj",
} as const satisfies Record<string, TaskPriority>;

const taskStatusFromApi = {
  NEW: "Nowe",
  TODO: "Do zrobienia",
  IN_PROGRESS: "W trakcie",
  WAITING_REVIEW: "Czeka na sprawdzenie",
  DONE: "Zrobione",
  CANCELLED: "Anulowane",
} as const satisfies Record<string, TaskStatus>;

type ApiAssignedUser = keyof typeof assignedUserFromApi;
type ApiTaskAuthor = keyof typeof taskAuthorFromApi;
type ApiTaskCategory = keyof typeof taskCategoryFromApi;
type ApiTaskPriority = keyof typeof taskPriorityFromApi;
type ApiTaskStatus = keyof typeof taskStatusFromApi;

const assignedUserToApi = {
  Admin: "ADMIN",
  Operator: "OPERATOR",
  Oboje: "BOTH",
} as const satisfies Record<AssignedUser, ApiAssignedUser>;

const taskCategoryToApi = {
  Piaskraft: "PIASKRAFT",
  PrestaShop: "PRESTASHOP",
  eBay: "EBAY",
  BaseLinker: "BASELINKER",
  MJW: "MJW",
  Marketing: "MARKETING",
  Dokumenty: "DOCUMENTS",
  Telefon: "PHONE",
  Prywatne: "PRIVATE",
  Inne: "OTHER",
} as const satisfies Record<TaskCategory, ApiTaskCategory>;

const taskPriorityToApi = {
  Niski: "LOW",
  Normalny: "NORMAL",
  Ważny: "IMPORTANT",
  Pilny: "URGENT",
  Dzisiaj: "TODAY",
} as const satisfies Record<TaskPriority, ApiTaskPriority>;

type ApiTaskComment = {
  id: number;
  taskId: number;
  author: ApiTaskAuthor;
  content: string;
  createdAt: string;
};

type ApiTask = {
  id: number;
  title: string;
  description: string;
  assignedTo: ApiAssignedUser;
  category: ApiTaskCategory;
  priority: ApiTaskPriority;
  status: ApiTaskStatus;
  date: string | null;
  time: string | null;
  createdBy: ApiTaskAuthor;
  createdAt: string;
  updatedAt: string;
  comments: ApiTaskComment[];
};

function mapCommentFromApi(comment: ApiTaskComment): TaskComment {
  return {
    id: comment.id,
    author: taskAuthorFromApi[comment.author],
    content: comment.content,
    createdAt: comment.createdAt.slice(0, 10),
  };
}

function mapTaskFromApi(task: ApiTask): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    assignedTo: assignedUserFromApi[task.assignedTo],
    category: taskCategoryFromApi[task.category],
    priority: taskPriorityFromApi[task.priority],
    status: taskStatusFromApi[task.status],
    date: task.date?.slice(0, 10) || "",
    time: task.time?.slice(11, 16) || undefined,
    createdBy: taskAuthorFromApi[task.createdBy],
    createdAt: task.createdAt.slice(0, 10),
    updatedAt: task.updatedAt.slice(0, 10),
    comments: task.comments.map(mapCommentFromApi),
  };
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${apiBaseUrl}/tasks`);

  if (!response.ok) {
    throw new Error("Nie udało się pobrać zadań.");
  }

  const tasks = (await response.json()) as ApiTask[];

  return tasks.map(mapTaskFromApi);
}

type CreateTaskInput = Pick<
  Task,
  | "title"
  | "description"
  | "assignedTo"
  | "category"
  | "priority"
  | "date"
  | "time"
>;

export async function createTask(task: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${apiBaseUrl}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: task.title,
      description: task.description,
      assignedTo: assignedUserToApi[task.assignedTo],
      category: taskCategoryToApi[task.category],
      priority: taskPriorityToApi[task.priority],
      date: task.date,
      time: task.time || undefined,
      createdBy: "ADMIN",
    }),
  });

  if (!response.ok) {
    throw new Error("Nie udało się utworzyć zadania.");
  }

  const createdTask = (await response.json()) as ApiTask;

  return mapTaskFromApi(createdTask);
}

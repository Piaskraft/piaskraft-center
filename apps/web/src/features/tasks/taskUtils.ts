import type { AssignedUser, Task } from "./taskTypes";

const assignedUserLabels: Record<AssignedUser, string> = {
  Admin: "Mateusz",
  Operator: "Agnieszka",
  Oboje: "Oboje",
};

export function getAssignedUserLabel(user: AssignedUser) {
  return assignedUserLabels[user];
}

export function isTaskOverdue(task: Task) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    Boolean(task.date) &&
    task.date < today &&
    task.status !== "Zrobione" &&
    task.status !== "Anulowane"
  );
}

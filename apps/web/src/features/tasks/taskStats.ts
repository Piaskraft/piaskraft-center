import type { Task } from "./taskTypes";
import { isTaskOverdue } from "./taskUtils";

export function getTaskStats(tasks: Task[]) {
  const today = new Date().toISOString().slice(0, 10);

  const currentTasks = tasks.filter((task) => task.archivedAt === null);
  const archivedTasks = tasks.filter((task) => task.archivedAt !== null);

  const tasksToday = currentTasks.filter(
    (task) => task.date === today && task.status !== "Anulowane",
  );

  const activeTasks = currentTasks.filter(
    (task) => task.status !== "Zrobione" && task.status !== "Anulowane",
  );

  const overdueTasks = currentTasks.filter((task) => isTaskOverdue(task));

  const urgentTasks = currentTasks.filter(
    (task) =>
      task.priority === "Pilny" &&
      task.status !== "Zrobione" &&
      task.status !== "Anulowane",
  );

  const doneTasks = currentTasks.filter((task) => task.status === "Zrobione");

  const cancelledTasks = currentTasks.filter(
    (task) => task.status === "Anulowane",
  );

  return {
    tasksToday: tasksToday.length,
    activeTasks: activeTasks.length,
    overdueTasks: overdueTasks.length,
    urgentTasks: urgentTasks.length,
    doneTasks: doneTasks.length,
    cancelledTasks: cancelledTasks.length,
    archivedTasks: archivedTasks.length,
  };
}

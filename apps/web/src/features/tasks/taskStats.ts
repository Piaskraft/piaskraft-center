import type { Task } from './taskTypes';
import { isTaskOverdue } from './taskUtils';

export function getTaskStats(tasks: Task[]) {
  const today = new Date().toISOString().slice(0, 10);

  const tasksToday = tasks.filter(
    (task) => task.date === today && task.status !== 'Anulowane',
  );

  const activeTasks = tasks.filter(
    (task) => task.status !== 'Zrobione' && task.status !== 'Anulowane',
  );

  const overdueTasks = tasks.filter((task) => isTaskOverdue(task));

  const urgentTasks = tasks.filter(
    (task) =>
      task.priority === 'Pilny' &&
      task.status !== 'Zrobione' &&
      task.status !== 'Anulowane',
  );

  const doneTasks = tasks.filter((task) => task.status === 'Zrobione');

  const cancelledTasks = tasks.filter((task) => task.status === 'Anulowane');

  return {
    tasksToday: tasksToday.length,
    activeTasks: activeTasks.length,
    overdueTasks: overdueTasks.length,
    urgentTasks: urgentTasks.length,
    doneTasks: doneTasks.length,
    cancelledTasks: cancelledTasks.length,
  };
}
import type { Task } from './taskTypes';

export function isTaskOverdue(task: Task) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    Boolean(task.date) &&
    task.date < today &&
    task.status !== 'Zrobione' &&
    task.status !== 'Anulowane'
  );
}
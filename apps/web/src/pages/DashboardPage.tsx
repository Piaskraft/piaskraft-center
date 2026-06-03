import { tasks } from '../features/tasks/taskMockData';
import { isTaskOverdue } from '../features/tasks/taskUtils';

export function DashboardPage() {
  const today = new Date().toISOString().slice(0, 10);

  const tasksToday = tasks.filter(
    (task) => task.date === today && task.status !== 'Anulowane',
  );

  const activeTasks = tasks.filter(
    (task) => task.status !== 'Zrobione' && task.status !== 'Anulowane',
  );

  const overdueTasks = tasks.filter((task) => isTaskOverdue(task));

  const doneTasks = tasks.filter((task) => task.status === 'Zrobione');

  return (
    <section className="dashboard-grid">
      <div className="dashboard-card">
        <span>Zadania dzisiaj</span>
        <strong>{tasksToday.length}</strong>
      </div>

      <div className="dashboard-card">
        <span>Aktywne zadania</span>
        <strong>{activeTasks.length}</strong>
      </div>

      <div className="dashboard-card">
        <span>Po terminie</span>
        <strong>{overdueTasks.length}</strong>
      </div>

      <div className="dashboard-card">
        <span>Zrobione</span>
        <strong>{doneTasks.length}</strong>
      </div>
    </section>
  );
}
import { tasks } from '../features/tasks/taskMockData';
import { getTaskStats } from '../features/tasks/taskStats';

export function DashboardPage() {
  const stats = getTaskStats(tasks);

  return (
    <section className="dashboard-grid">
      <div className="dashboard-card">
        <span>Zadania dzisiaj</span>
        <strong>{stats.tasksToday}</strong>
      </div>

      <div className="dashboard-card">
        <span>Aktywne zadania</span>
        <strong>{stats.activeTasks}</strong>
      </div>

      <div className="dashboard-card">
        <span>Po terminie</span>
        <strong>{stats.overdueTasks}</strong>
      </div>

      <div className="dashboard-card">
        <span>Pilne</span>
        <strong>{stats.urgentTasks}</strong>
      </div>

      <div className="dashboard-card">
        <span>Zrobione</span>
        <strong>{stats.doneTasks}</strong>
      </div>

      <div className="dashboard-card">
        <span>Anulowane</span>
        <strong>{stats.cancelledTasks}</strong>
      </div>
    </section>
  );
}
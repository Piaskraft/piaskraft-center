import { useEffect, useState } from "react";
import { getTasks } from "../features/tasks/taskApi";
import { getTaskStats } from "../features/tasks/taskStats";
import type { Task } from "../features/tasks/taskTypes";

export function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    getTasks()
      .then((tasksFromApi) => {
        if (!isCancelled) {
          setTasks(tasksFromApi);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setLoadError(
            "Nie udało się pobrać statystyk. Sprawdź, czy API działa.",
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="empty-state">
        <h3>Ładowanie statystyk...</h3>
        <p>Pobieramy zadania z API.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="empty-state">
        <h3>Nie udało się pobrać statystyk</h3>
        <p>{loadError}</p>
      </div>
    );
  }

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

      <div className="dashboard-card">
        <span>Archiwum</span>
        <strong>{stats.archivedTasks}</strong>
      </div>
    </section>
  );
}

import { tasks } from '../features/tasks/taskMockData';

const scheduledTasks = tasks
  .filter((task) => task.date)
  .sort((a, b) => `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`));

export function CalendarPage() {
  return (
    <section className="calendar-page">
      <div className="page-actions">
        <div>
          <h2>Kalendarz</h2>
          <p>Najbliższe terminy z zadań.</p>
        </div>
      </div>

      <div className="calendar-list">
        {scheduledTasks.map((task) => (
          <article key={task.id} className="calendar-item">
            <div className="calendar-date">
              <strong>{task.date}</strong>
              <span>{task.time || 'Bez godziny'}</span>
            </div>

            <div>
              <h3>{task.title}</h3>
              <p>
                {task.category} · {task.assignedTo} · {task.priority} · {task.status}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
import { tasks } from '../features/tasks/taskMockData';
import { isTaskOverdue } from '../features/tasks/taskUtils';

const scheduledTasks = tasks
  .filter((task) => task.date)
  .sort((a, b) =>
    `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`),
  );

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
        {scheduledTasks.map((task) => {
          const isOverdue = isTaskOverdue(task);

          const calendarStatus = isOverdue ? 'Po terminie' : task.status;

          const itemClassName = [
            'calendar-item',
            isOverdue ? 'calendar-item-overdue' : '',
            task.status === 'Zrobione' ? 'calendar-item-done' : '',
            task.status === 'Anulowane' ? 'calendar-item-cancelled' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <article key={task.id} className={itemClassName}>
              <div className="calendar-date">
                <strong>{task.date}</strong>
                <span>{task.time || 'Bez godziny'}</span>
              </div>

              <div className="calendar-content">
                <h3>{task.title}</h3>
                <p>
                  {task.category} · {task.assignedTo} · {task.priority}
                </p>
              </div>

              <span className="calendar-status-badge">{calendarStatus}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
import type { Task } from '../tasks/taskTypes';
import { isTaskOverdue } from '../tasks/taskUtils';
import { formatDate, getCalendarStatusLabel } from './calendarUtils';

type DayCalendarViewProps = {
  selectedDate: Date;
  tasks: Task[];
};

export function DayCalendarView({ selectedDate, tasks }: DayCalendarViewProps) {
  const selectedDateString = formatDate(selectedDate);

  const dayTasks = tasks
    .filter((task) => task.date === selectedDateString)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  return (
    <div className="day-view">
      <div className="day-view-header">
        <h3>{selectedDateString}</h3>
        <p>Terminy wybranego dnia.</p>
      </div>

      {dayTasks.length === 0 ? (
        <div className="empty-state">
          <h3>Brak terminów</h3>
          <p>Na ten dzień nie ma żadnych zaplanowanych zadań.</p>
        </div>
      ) : (
        <div className="day-events">
          {dayTasks.map((task) => {
            const isOverdue = isTaskOverdue(task);

            return (
              <article
                key={task.id}
                className={
                  isOverdue ? 'day-event day-event-overdue' : 'day-event'
                }
              >
                <div className="day-event-time">
                  {task.time || 'Bez godziny'}
                </div>

                <div className="day-event-content">
                  <h3>{task.title}</h3>
                  <p>
                    {task.category} · {task.assignedTo} · {task.priority}
                  </p>
                </div>

                <span className="calendar-status-badge">
                  {getCalendarStatusLabel(task)}
                </span>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
import type { Task } from '../tasks/taskTypes';
import { isTaskOverdue } from '../tasks/taskUtils';
import { getCalendarStatusLabel } from './calendarUtils';

type WeekDay = {
  name: string;
  date: string;
};

type WeekCalendarViewProps = {
  weekDays: WeekDay[];
  tasks: Task[];
};

export function WeekCalendarView({ weekDays, tasks }: WeekCalendarViewProps) {
  return (
    <div className="week-grid">
      {weekDays.map((day) => {
        const dayTasks = tasks.filter((task) => task.date === day.date);

        return (
          <article key={day.date} className="week-day-card">
            <div className="week-day-header">
              <strong>{day.name}</strong>
              <span>{day.date}</span>
            </div>

            {dayTasks.length === 0 ? (
              <p className="week-empty">Brak terminów</p>
            ) : (
              <div className="week-events">
                {dayTasks.map((task) => {
                  const isOverdue = isTaskOverdue(task);

                  return (
                    <div
                      key={task.id}
                      className={
                        isOverdue
                          ? 'week-event week-event-overdue'
                          : 'week-event'
                      }
                    >
                      <span>{task.time || 'Bez godziny'}</span>
                      <strong>{task.title}</strong>
                      <small>
                        {task.category} · {task.assignedTo} ·{' '}
                        {getCalendarStatusLabel(task)}
                      </small>
                    </div>
                  );
                })}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
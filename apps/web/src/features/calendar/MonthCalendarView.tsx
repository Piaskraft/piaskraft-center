import type { Task } from '../tasks/taskTypes';

type MonthDay = {
  date: string;
  dayNumber: number;
};

type MonthCalendarViewProps = {
  monthDays: MonthDay[];
  tasks: Task[];
  today: string;
  onSelectDay: (dateString: string) => void;
};

export function MonthCalendarView({
  monthDays,
  tasks,
  today,
  onSelectDay,
}: MonthCalendarViewProps) {
  return (
    <div className="month-grid">
      {monthDays.map((day) => {
        const dayTasks = tasks.filter((task) => task.date === day.date);

        return (
          <article
            key={day.date}
            className={
              day.date === today
                ? 'month-day-card month-day-card-today'
                : 'month-day-card'
            }
            onClick={() => onSelectDay(day.date)}
          >
            <div className="month-day-number">{day.dayNumber}</div>
            <div className="month-day-date">{day.date}</div>

            {dayTasks.length === 0 ? (
              <p>Brak terminów</p>
            ) : (
              <strong>{dayTasks.length} termin</strong>
            )}
          </article>
        );
      })}
    </div>
  );
}
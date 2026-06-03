import { useState } from 'react';
import { tasks } from '../features/tasks/taskMockData';
import { isTaskOverdue } from '../features/tasks/taskUtils';

const weekDayNames = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getMonday(date: Date) {
  const currentDate = new Date(date);
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(currentDate.setDate(diff));
}

function getWeekDays(date: Date) {
  const monday = getMonday(date);

  return weekDayNames.map((dayName, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);

    return {
      name: dayName,
      date: formatDate(day),
    };
  });
}

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = getWeekDays(selectedDate);

  function goToPreviousWeek() {
    setSelectedDate((currentDate) => {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      return newDate;
    });
  }

  function goToNextWeek() {
    setSelectedDate((currentDate) => {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      return newDate;
    });
  }

  function goToCurrentWeek() {
    setSelectedDate(new Date());
  }

  return (
    <section className="calendar-page">
      <div className="page-actions">
        <div>
          <h2>Kalendarz</h2>
          <p>Widok tygodnia z terminami zadań.</p>
        </div>

        <div className="calendar-actions">
          <button className="secondary-button" onClick={goToPreviousWeek}>
            Poprzedni tydzień
          </button>

          <button className="secondary-button" onClick={goToCurrentWeek}>
            Ten tydzień
          </button>

          <button className="secondary-button" onClick={goToNextWeek}>
            Następny tydzień
          </button>
        </div>
      </div>

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
                          {isOverdue ? 'Po terminie' : task.status}
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
    </section>
  );
}
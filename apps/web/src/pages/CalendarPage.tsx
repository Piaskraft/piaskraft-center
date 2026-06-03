import { useState } from 'react';
import { tasks } from '../features/tasks/taskMockData';
import { isTaskOverdue } from '../features/tasks/taskUtils';

type CalendarViewMode = 'Dzień' | 'Tydzień' | 'Miesiąc' | 'Lista';

const calendarViewModes: CalendarViewMode[] = [
  'Dzień',
  'Tydzień',
  'Miesiąc',
  'Lista',
];

const weekDayNames = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
];

const scheduledTasks = tasks
  .filter((task) => task.date)
  .sort((a, b) =>
    `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`),
  );

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

function getCalendarStatusLabel(task: (typeof tasks)[number]) {
  if (isTaskOverdue(task)) return 'Po terminie';
  return task.status;
}

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('Tydzień');

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
          <p>Widok czasu: dzień, tydzień, miesiąc i lista terminów.</p>
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

      <div className="calendar-view-tabs">
        {calendarViewModes.map((mode) => (
          <button
            key={mode}
            className={
              viewMode === mode ? 'calendar-view-tab active' : 'calendar-view-tab'
            }
            onClick={() => setViewMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      {viewMode === 'Lista' && (
        <div className="calendar-list-view">
          {scheduledTasks.map((task) => {
            const isOverdue = isTaskOverdue(task);
            const statusLabel = getCalendarStatusLabel(task);

            return (
              <article
                key={task.id}
                className={
                  isOverdue
                    ? 'calendar-list-event calendar-list-event-overdue'
                    : 'calendar-list-event'
                }
              >
                <div className="calendar-list-date">
                  <strong>{task.date}</strong>
                  <span>{task.time || 'Bez godziny'}</span>
                </div>

                <div className="calendar-list-content">
                  <h3>{task.title}</h3>
                  <p>
                    {task.category} · {task.assignedTo} · {task.priority}
                  </p>
                </div>

                <span className="calendar-status-badge">{statusLabel}</span>
              </article>
            );
          })}
        </div>
      )}

      {viewMode !== 'Tydzień' && viewMode !== 'Lista' && (
        <div className="empty-state">
          <h3>Widok „{viewMode}”</h3>
          <p>Ten widok przygotujemy w kolejnym etapie kalendarza.</p>
        </div>
      )}

      {viewMode === 'Tydzień' && (
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
      )}
    </section>
  );
}
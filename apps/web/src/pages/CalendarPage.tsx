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

function getMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const currentDate = new Date(year, month, day);

    days.push({
      dayNumber: day,
      date: formatDate(currentDate),
    });
  }

  return days;
}

function getCalendarStatusLabel(task: (typeof tasks)[number]) {
  if (isTaskOverdue(task)) return 'Po terminie';
  return task.status;
}

function getNavigationLabels(viewMode: CalendarViewMode) {
  if (viewMode === 'Dzień') {
    return {
      previous: 'Poprzedni dzień',
      current: 'Dzisiaj',
      next: 'Następny dzień',
    };
  }

  if (viewMode === 'Miesiąc') {
    return {
      previous: 'Poprzedni miesiąc',
      current: 'Ten miesiąc',
      next: 'Następny miesiąc',
    };
  }

  return {
    previous: 'Poprzedni tydzień',
    current: 'Ten tydzień',
    next: 'Następny tydzień',
  };
}

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('Tydzień');
const weekDays = getWeekDays(selectedDate);
const monthDays = getMonthDays(selectedDate);
const today = formatDate(new Date());
const navigationLabels = getNavigationLabels(viewMode);

  function goToPreviousPeriod() {
    setSelectedDate((currentDate) => {
      const newDate = new Date(currentDate);

      if (viewMode === 'Dzień') {
        newDate.setDate(currentDate.getDate() - 1);
      }

      if (viewMode === 'Tydzień') {
        newDate.setDate(currentDate.getDate() - 7);
      }

      if (viewMode === 'Miesiąc') {
        newDate.setMonth(currentDate.getMonth() - 1);
      }

      return newDate;
    });
  }

  function goToNextPeriod() {
    setSelectedDate((currentDate) => {
      const newDate = new Date(currentDate);

      if (viewMode === 'Dzień') {
        newDate.setDate(currentDate.getDate() + 1);
      }

      if (viewMode === 'Tydzień') {
        newDate.setDate(currentDate.getDate() + 7);
      }

      if (viewMode === 'Miesiąc') {
        newDate.setMonth(currentDate.getMonth() + 1);
      }

      return newDate;
    });
  }

  function goToCurrentPeriod() {
    setSelectedDate(new Date());
  }

  return (
    <section className="calendar-page">
      <div className="page-actions">
        <div>
          <h2>Kalendarz</h2>
          <p>Widok czasu: dzień, tydzień, miesiąc i lista terminów.</p>
        </div>

        {viewMode !== 'Lista' && (
          <div className="calendar-actions">
            <button className="secondary-button" onClick={goToPreviousPeriod}>
              {navigationLabels.previous}
            </button>

            <button className="secondary-button" onClick={goToCurrentPeriod}>
              {navigationLabels.current}
            </button>

            <button className="secondary-button" onClick={goToNextPeriod}>
              {navigationLabels.next}
            </button>
          </div>
        )}
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

      {viewMode === 'Dzień' && (
        <div className="day-view">
          <div className="day-view-header">
            <h3>{formatDate(selectedDate)}</h3>
            <p>Terminy wybranego dnia.</p>
          </div>

          {tasks.filter((task) => task.date === formatDate(selectedDate))
            .length === 0 ? (
            <div className="empty-state">
              <h3>Brak terminów</h3>
              <p>Na ten dzień nie ma żadnych zaplanowanych zadań.</p>
            </div>
          ) : (
            <div className="day-events">
              {tasks
                .filter((task) => task.date === formatDate(selectedDate))
                .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                .map((task) => {
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
      )}

      {viewMode === 'Miesiąc' && (
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
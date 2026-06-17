import { useState } from 'react';
import {
  calendarViewModes,
  createDateFromDateString,
  formatDate,
  getMonthDays,
  getNavigationLabels,
  getWeekDays,
  type CalendarViewMode,
} from '../features/calendar/calendarUtils';
import { CalendarListView } from '../features/calendar/CalendarListView';
import { DayCalendarView } from '../features/calendar/DayCalendarView';
import { WeekCalendarView } from '../features/calendar/WeekCalendarView';
import { tasks } from '../features/tasks/taskMockData';

const scheduledTasks = tasks
  .filter((task) => task.date)
  .sort((a, b) =>
    `${a.date} ${a.time || ''}`.localeCompare(`${b.date} ${b.time || ''}`),
  );

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

  function handleSelectMonthDay(dateString: string) {
    setSelectedDate(createDateFromDateString(dateString));
    setViewMode('Dzień');
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
              viewMode === mode
                ? 'calendar-view-tab active'
                : 'calendar-view-tab'
            }
            onClick={() => setViewMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      {viewMode === 'Lista' && <CalendarListView tasks={scheduledTasks} />}

      {viewMode === 'Dzień' && (
        <DayCalendarView selectedDate={selectedDate} tasks={tasks} />
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
                onClick={() => handleSelectMonthDay(day.date)}
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
        <WeekCalendarView weekDays={weekDays} tasks={tasks} />
      )}
    </section>
  );
}
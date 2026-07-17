import { useState } from "react";
import {
  calendarViewModes,
  createDateFromDateString,
  formatDate,
  getMonthDays,
  getNavigationLabels,
  getWeekDays,
  type CalendarViewMode,
} from "../features/calendar/calendarUtils";
import { CalendarListView } from "../features/calendar/CalendarListView";
import { DayCalendarView } from "../features/calendar/DayCalendarView";
import { MonthCalendarView } from "../features/calendar/MonthCalendarView";
import { WeekCalendarView } from "../features/calendar/WeekCalendarView";
import { tasks } from "../features/tasks/taskMockData";

const scheduledTasks = tasks
  .filter((task) => task.date)
  .sort((a, b) =>
    `${a.date} ${a.time || ""}`.localeCompare(`${b.date} ${b.time || ""}`),
  );

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("Tydzień");

  const today = formatDate(new Date());
  const weekDays = getWeekDays(selectedDate);
  const monthDays = getMonthDays(selectedDate);
  const navigationLabels = getNavigationLabels(viewMode);

  function changePeriod(direction: -1 | 1) {
    setSelectedDate((currentDate) => {
      const newDate = new Date(currentDate);

      if (viewMode === "Dzień") {
        newDate.setDate(currentDate.getDate() + direction);
      }

      if (viewMode === "Tydzień") {
        newDate.setDate(currentDate.getDate() + direction * 7);
      }

      if (viewMode === "Miesiąc") {
        newDate.setMonth(currentDate.getMonth() + direction);
      }

      return newDate;
    });
  }

  function goToCurrentPeriod() {
    setSelectedDate(new Date());
  }

  function handleSelectMonthDay(dateString: string) {
    setSelectedDate(createDateFromDateString(dateString));
    setViewMode("Dzień");
  }

  return (
    <section className="calendar-page">
      <div className="page-actions">
        <div>
          <h2>Kalendarz</h2>
          <p>Widok czasu: dzień, tydzień, miesiąc i lista terminów.</p>
        </div>

        {viewMode !== "Lista" && (
          <div className="calendar-actions">
            <button
              className="secondary-button"
              onClick={() => changePeriod(-1)}
            >
              {navigationLabels.previous}
            </button>

            <button className="secondary-button" onClick={goToCurrentPeriod}>
              {navigationLabels.current}
            </button>

            <button
              className="secondary-button"
              onClick={() => changePeriod(1)}
            >
              {navigationLabels.next}
            </button>
          </div>
        )}
      </div>

      <div className="calendar-view-tabs">
        {calendarViewModes.map((mode) => (
          <button
            key={mode}
            className={`calendar-view-tab${viewMode === mode ? " active" : ""}`}
            onClick={() => setViewMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>

      {viewMode === "Lista" && <CalendarListView tasks={scheduledTasks} />}

      {viewMode === "Dzień" && (
        <DayCalendarView selectedDate={selectedDate} tasks={tasks} />
      )}

      {viewMode === "Tydzień" && (
        <WeekCalendarView weekDays={weekDays} tasks={tasks} />
      )}

      {viewMode === "Miesiąc" && (
        <MonthCalendarView
          monthDays={monthDays}
          tasks={tasks}
          today={today}
          onSelectDay={handleSelectMonthDay}
        />
      )}
    </section>
  );
}

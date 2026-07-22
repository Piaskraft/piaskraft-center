import { useEffect, useState } from "react";
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
import { getTasks } from "../features/tasks/taskApi";
import type { Task } from "../features/tasks/taskTypes";

export function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("Tydzień");

  useEffect(() => {
    let isCancelled = false;

    getTasks()
      .then((tasksFromApi) => {
        if (!isCancelled) {
          setTasks(tasksFromApi);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setLoadError("Nie udało się pobrać zadań. Sprawdź, czy API działa.");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const calendarTasks = tasks.filter(
    (task) =>
      task.date && task.archivedAt === null && task.status !== "Anulowane",
  );

  const scheduledTasks = [...calendarTasks].sort((a, b) =>
    `${a.date} ${a.time || ""}`.localeCompare(`${b.date} ${b.time || ""}`),
  );

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

  if (isLoading) {
    return (
      <div className="empty-state">
        <h3>Ładowanie kalendarza...</h3>
        <p>Pobieramy zadania z API.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="empty-state">
        <h3>Nie udało się otworzyć kalendarza</h3>
        <p>{loadError}</p>
      </div>
    );
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
        <DayCalendarView selectedDate={selectedDate} tasks={calendarTasks} />
      )}

      {viewMode === "Tydzień" && (
        <WeekCalendarView weekDays={weekDays} tasks={calendarTasks} />
      )}

      {viewMode === "Miesiąc" && (
        <MonthCalendarView
          monthDays={monthDays}
          tasks={calendarTasks}
          today={today}
          onSelectDay={handleSelectMonthDay}
        />
      )}
    </section>
  );
}

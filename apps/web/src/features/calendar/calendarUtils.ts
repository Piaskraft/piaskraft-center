import type { Task } from "../tasks/taskTypes";
import { isTaskOverdue } from "../tasks/taskUtils";

export type CalendarViewMode = "Dzień" | "Tydzień" | "Miesiąc" | "Lista";

export const calendarViewModes: CalendarViewMode[] = [
  "Dzień",
  "Tydzień",
  "Miesiąc",
  "Lista",
];

const weekDayNames = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
export function createDateFromDateString(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function formatFullCalendarDate(dateString: string) {
  const formattedDate = new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(createDateFromDateString(dateString));

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

function getMonday(date: Date) {
  const currentDate = new Date(date);
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(currentDate.setDate(diff));
}

export function getWeekDays(date: Date) {
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

export function getMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const currentDate = new Date(year, month, day);

    days.push({
      dayNumber: day,
      date: formatDate(currentDate),
      weekDayColumn: currentDate.getDay() === 0 ? 7 : currentDate.getDay(),
    });
  }

  return days;
}

export function getCalendarStatusLabel(task: Task) {
  if (isTaskOverdue(task)) return "Po terminie";

  return task.status;
}

export function getNavigationLabels(viewMode: CalendarViewMode) {
  if (viewMode === "Dzień") {
    return {
      previous: "Poprzedni dzień",
      current: "Dzisiaj",
      next: "Następny dzień",
    };
  }

  if (viewMode === "Miesiąc") {
    return {
      previous: "Poprzedni miesiąc",
      current: "Ten miesiąc",
      next: "Następny miesiąc",
    };
  }

  return {
    previous: "Poprzedni tydzień",
    current: "Ten tydzień",
    next: "Następny tydzień",
  };
}
export function formatCalendarWeekday(dateString: string) {
  const weekday = new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
  }).format(createDateFromDateString(dateString));

  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

import type { Task } from "../tasks/taskTypes";
import { getAssignedUserLabel, isTaskOverdue } from "../tasks/taskUtils";
import { getCalendarStatusLabel } from "./calendarUtils";

type CalendarListViewProps = {
  tasks: Task[];
};

export function CalendarListView({ tasks }: CalendarListViewProps) {
  return (
    <div className="calendar-list-view">
      {tasks.map((task) => {
        const isOverdue = isTaskOverdue(task);
        const statusLabel = getCalendarStatusLabel(task);

        return (
          <article
            key={task.id}
            className={
              isOverdue
                ? "calendar-list-event calendar-list-event-overdue"
                : "calendar-list-event"
            }
          >
            <div className="calendar-list-date">
              <strong>{task.date}</strong>
              <span>{task.time || "Bez godziny"}</span>
            </div>

            <div className="calendar-list-content">
              <h3>{task.title}</h3>
              <p>
                {task.category} · {getAssignedUserLabel(task.assignedTo)} ·{" "}
                {task.priority}
              </p>
            </div>

            <span className="calendar-status-badge">{statusLabel}</span>
          </article>
        );
      })}
    </div>
  );
}

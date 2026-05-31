import type { Task, TaskStatus } from './taskTypes';

type TaskCardProps = {
  task: Task;
  taskStatuses: TaskStatus[];
  onChangeStatus: (taskId: number, status: TaskStatus) => void;
};

export function TaskCard({
  task,
  taskStatuses,
  onChangeStatus,
}: TaskCardProps) {
  return (
    <article className="task-card">
      <div>
        <h3>{task.title}</h3>
        <p>
          {task.category} · {task.assignedTo}
        </p>
      </div>

      <div className="task-meta">
        <span>{task.priority}</span>

        <select
          className="status-select"
          value={task.status}
          onChange={(event) =>
            onChangeStatus(task.id, event.target.value as TaskStatus)
          }
        >
          {taskStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        {task.date && <span>{task.date}</span>}
        {task.time && <span>{task.time}</span>}
      </div>
    </article>
  );
}
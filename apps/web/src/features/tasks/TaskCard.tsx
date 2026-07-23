import { useState, type FormEvent } from "react";
import type { Task, TaskStatus } from "./taskTypes";
import { getAssignedUserLabel, isTaskOverdue } from "./taskUtils";

type TaskCardProps = {
  task: Task;
  taskStatuses: TaskStatus[];
  onChangeStatus: (taskId: number, status: TaskStatus) => void;
  onAddComment: (taskId: number, content: string) => void;
  onDeleteComment: (taskId: number, commentId: number) => void;
  onCancelTask: (taskId: number) => void;
  onArchiveTask: (taskId: number) => void;
  onRestoreTask: (taskId: number) => void;
  isInitiallyExpanded?: boolean;
};

export function TaskCard({
  task,
  taskStatuses,
  isInitiallyExpanded = false,
  onChangeStatus,
  onAddComment,
  onDeleteComment,
  onCancelTask,
  onArchiveTask,
  onRestoreTask,
}: TaskCardProps) {
  const [isDetailsVisible, setIsDetailsVisible] = useState(isInitiallyExpanded);
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);

  const isOverdue = isTaskOverdue(task);

  function handleAddComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const content = String(formData.get("comment") || "").trim();

    if (!content) return;

    onAddComment(task.id, content);
    event.currentTarget.reset();
    setIsCommentFormVisible(false);
    setIsDetailsVisible(true);
  }

  return (
    <article
      className={
        task.status === "Anulowane"
          ? "task-card task-card-cancelled"
          : "task-card"
      }
    >
      <div className="task-main">
        <h3>{task.title}</h3>

        <p className="task-subline">
          {task.category} · {getAssignedUserLabel(task.assignedTo)} · utworzył:{" "}
          {getAssignedUserLabel(task.createdBy)} · komentarze:{" "}
          {task.comments.length}
        </p>

        {isDetailsVisible && (
          <div className="task-details">
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            {task.comments.length > 0 && (
              <div className="task-comments">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="task-comment">
                    <strong>{comment.author}</strong>
                    <span>{comment.createdAt}</span>
                    <p>{comment.content}</p>

                    <button
                      type="button"
                      className="danger-text-button"
                      onClick={() => onDeleteComment(task.id, comment.id)}
                    >
                      Usuń komentarz
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isCommentFormVisible && (
              <form className="comment-form" onSubmit={handleAddComment}>
                <input
                  name="comment"
                  type="text"
                  placeholder="Wpisz komentarz do zadania..."
                />

                <button type="submit" className="primary-button small-button">
                  Zapisz
                </button>
              </form>
            )}
          </div>
        )}

        <div className="task-actions">
          {task.archivedAt && (
            <button
              type="button"
              className="text-button"
              onClick={() => onRestoreTask(task.id)}
            >
              Przywróć zadanie
            </button>
          )}

          {!task.archivedAt &&
            (task.status === "Zrobione" || task.status === "Anulowane") && (
              <button
                type="button"
                className="text-button"
                onClick={() => onArchiveTask(task.id)}
              >
                Archiwizuj zadanie
              </button>
            )}

          {task.status !== "Anulowane" && task.status !== "Zrobione" && (
            <button
              type="button"
              className="danger-text-button"
              onClick={() => onCancelTask(task.id)}
            >
              Anuluj zadanie
            </button>
          )}

          <button
            type="button"
            className="text-button"
            onClick={() => setIsDetailsVisible((currentValue) => !currentValue)}
          >
            {isDetailsVisible ? "Ukryj szczegóły" : "Pokaż szczegóły"}
          </button>

          <button
            type="button"
            className="text-button"
            onClick={() => {
              setIsDetailsVisible(true);
              setIsCommentFormVisible((currentValue) => !currentValue);
            }}
          >
            {isCommentFormVisible ? "Anuluj komentarz" : "Dodaj komentarz"}
          </button>
        </div>
      </div>

      <div className="task-meta">
        {isOverdue && <span className="danger-badge">Po terminie</span>}

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

import { useState, type FormEvent } from 'react';
import type { Task, TaskStatus } from './taskTypes';

type TaskCardProps = {
  task: Task;
  taskStatuses: TaskStatus[];
  onChangeStatus: (taskId: number, status: TaskStatus) => void;
  onAddComment: (taskId: number, content: string) => void;
};

export function TaskCard({
  task,
  taskStatuses,
  onChangeStatus,
  onAddComment,
}: TaskCardProps) {
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);

  function handleAddComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const content = String(formData.get('comment') || '').trim();

    if (!content) return;

    onAddComment(task.id, content);
    event.currentTarget.reset();
    setIsCommentFormVisible(false);
  }

  return (
    <article className="task-card">
      <div className="task-main">
        <h3>{task.title}</h3>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <p className="task-subline">
          {task.category} · {task.assignedTo} · utworzył: {task.createdBy} ·
          komentarze: {task.comments.length}
        </p>

        {task.comments.length > 0 && (
          <div className="task-comments">
            {task.comments.map((comment) => (
              <div key={comment.id} className="task-comment">
                <strong>{comment.author}</strong>
                <span>{comment.createdAt}</span>
                <p>{comment.content}</p>
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

        <button
          type="button"
          className="text-button"
          onClick={() =>
            setIsCommentFormVisible((currentValue) => !currentValue)
          }
        >
          {isCommentFormVisible ? 'Anuluj komentarz' : 'Dodaj komentarz'}
        </button>
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
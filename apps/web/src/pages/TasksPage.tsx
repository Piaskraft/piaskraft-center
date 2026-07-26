import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TaskCard } from "../features/tasks/TaskCard";
import { TaskForm, type NewTaskData } from "../features/tasks/TaskForm";
import {
  addTaskComment,
  archiveTask,
  createTask,
  deleteTaskComment,
  getTasks,
  restoreTask,
  updateTaskStatus,
} from "../features/tasks/taskApi";
import {
  taskFilters,
  taskStatuses,
  type TaskFilter,
} from "../features/tasks/taskOptions";
import type { Task, TaskStatus } from "../features/tasks/taskTypes";
import { useUser } from "../features/users/useUser";

export function TasksPage() {
  const { currentUser } = useUser();
  const [searchParams] = useSearchParams();
  const selectedTaskId = Number(searchParams.get("task"));
  const initialDate = searchParams.get("date") ?? "";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(Boolean(initialDate));
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("Wszystkie");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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
          setTasks([]);
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

  async function handleAddTask(newTask: NewTaskData) {
    setActionError("");

    try {
      const createdTask = await createTask(newTask, currentUser.role);

      setTasks((currentTasks) => [createdTask, ...currentTasks]);
      setIsFormVisible(false);
    } catch {
      setActionError("Nie udało się zapisać zadania. Spróbuj ponownie.");
    }
  }

  async function handleAddTaskComment(taskId: number, content: string) {
    setActionError("");

    try {
      const createdComment = await addTaskComment(
        taskId,
        content,
        currentUser.role,
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                comments: [...task.comments, createdComment],
              }
            : task,
        ),
      );
    } catch {
      setActionError("Nie udało się dodać komentarza.");
    }
  }

  async function handleDeleteTaskComment(taskId: number, commentId: number) {
    const shouldDelete = window.confirm(
      "Czy na pewno chcesz usunąć ten komentarz?",
    );

    if (!shouldDelete) return;

    setActionError("");

    try {
      await deleteTaskComment(taskId, commentId);

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                comments: task.comments.filter(
                  (comment) => comment.id !== commentId,
                ),
              }
            : task,
        ),
      );
    } catch {
      setActionError("Nie udało się usunąć komentarza.");
    }
  }

  async function handleChangeTaskStatus(taskId: number, status: TaskStatus) {
    setActionError("");

    try {
      const updatedTask = await updateTaskStatus(taskId, status);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch {
      setActionError("Nie udało się zmienić statusu zadania.");
    }
  }

  function handleCancelTask(taskId: number) {
    void handleChangeTaskStatus(taskId, "Anulowane");
  }

  async function handleArchiveTask(taskId: number) {
    setActionError("");

    try {
      const archivedTask = await archiveTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? archivedTask : task)),
      );
    } catch {
      setActionError("Nie udało się przenieść zadania do archiwum.");
    }
  }

  async function handleRestoreTask(taskId: number) {
    setActionError("");

    try {
      const restoredTask = await restoreTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? restoredTask : task)),
      );
    } catch {
      setActionError("Nie udało się przywrócić zadania z archiwum.");
    }
  }

  const activeTasks = tasks.filter((task) => task.archivedAt === null);

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "Archiwum") return task.archivedAt !== null;
    if (task.archivedAt !== null) return false;

    if (activeFilter === "Wszystkie") return true;
    if (activeFilter === "Admin") return task.assignedTo === "Admin";
    if (activeFilter === "Operator") return task.assignedTo === "Operator";
    if (activeFilter === "Oboje") return task.assignedTo === "Oboje";
    if (activeFilter === "Pilne") return task.priority === "Pilny";
    if (activeFilter === "Zrobione") return task.status === "Zrobione";
    if (activeFilter === "Anulowane") return task.status === "Anulowane";

    return true;
  });

  const taskFilterCounts: Record<TaskFilter, number> = {
    Wszystkie: activeTasks.length,
    Admin: activeTasks.filter((task) => task.assignedTo === "Admin").length,
    Operator: activeTasks.filter((task) => task.assignedTo === "Operator")
      .length,
    Oboje: activeTasks.filter((task) => task.assignedTo === "Oboje").length,
    Pilne: activeTasks.filter((task) => task.priority === "Pilny").length,
    Zrobione: activeTasks.filter((task) => task.status === "Zrobione").length,
    Anulowane: activeTasks.filter((task) => task.status === "Anulowane").length,
    Archiwum: tasks.filter((task) => task.archivedAt !== null).length,
  };

  return (
    <section className="tasks-page">
      <div className="page-actions">
        <div>
          <h2>Zadania</h2>
          <p>Lista zadań dla admina i operatora.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setIsFormVisible((currentValue) => !currentValue)}
        >
          {isFormVisible ? "Zamknij formularz" : "Dodaj zadanie"}
        </button>
      </div>

      {isFormVisible && (
        <TaskForm onAddTask={handleAddTask} initialDate={initialDate} />
      )}

      {actionError && <div className="form-error">{actionError}</div>}

      {!isLoading && !loadError && (
        <div className="task-filters">
          {taskFilters.map((filter) => (
            <button
              key={filter}
              className={
                activeFilter === filter
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "Admin"
                ? "Mateusz"
                : filter === "Operator"
                  ? "Agnieszka"
                  : filter}
              <span>{taskFilterCounts[filter]}</span>
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="empty-state">
          <h3>Ładowanie zadań...</h3>
          <p>Pobieramy dane z API.</p>
        </div>
      ) : loadError ? (
        <div className="empty-state">
          <h3>Nie udało się pobrać zadań</h3>
          <p>{loadError}</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>Brak zadań</h3>
          <p>Nie ma zadań pasujących do wybranego filtra.</p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              taskStatuses={taskStatuses}
              isInitiallyExpanded={task.id === selectedTaskId}
              onChangeStatus={handleChangeTaskStatus}
              onAddComment={handleAddTaskComment}
              onDeleteComment={handleDeleteTaskComment}
              onCancelTask={handleCancelTask}
              onArchiveTask={handleArchiveTask}
              onRestoreTask={handleRestoreTask}
            />
          ))}
        </div>
      )}
    </section>
  );
}

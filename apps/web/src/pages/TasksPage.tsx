import { useEffect, useState } from "react";
import { TaskCard } from "../features/tasks/TaskCard";
import { TaskForm, type NewTaskData } from "../features/tasks/TaskForm";
import {
  addTaskComment,
  createTask,
  getTasks,
  updateTaskStatus,
} from "../features/tasks/taskApi";
import {
  taskFilters,
  taskStatuses,
  type TaskFilter,
} from "../features/tasks/taskOptions";
import type { Task, TaskStatus } from "../features/tasks/taskTypes";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("Wszystkie");
  const [actionError, setActionError] = useState("");

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
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  async function handleAddTask(newTask: NewTaskData) {
    setActionError("");

    try {
      const createdTask = await createTask(newTask);

      setTasks((currentTasks) => [createdTask, ...currentTasks]);
      setIsFormVisible(false);
    } catch {
      setActionError("Nie udało się zapisać zadania. Spróbuj ponownie.");
    }
  }

  async function handleAddTaskComment(taskId: number, content: string) {
    setActionError("");

    try {
      const createdComment = await addTaskComment(taskId, content);

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

  const filteredTasks = tasks.filter((task) => {
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
    Wszystkie: tasks.length,
    Admin: tasks.filter((task) => task.assignedTo === "Admin").length,
    Operator: tasks.filter((task) => task.assignedTo === "Operator").length,
    Oboje: tasks.filter((task) => task.assignedTo === "Oboje").length,
    Pilne: tasks.filter((task) => task.priority === "Pilny").length,
    Zrobione: tasks.filter((task) => task.status === "Zrobione").length,
    Anulowane: tasks.filter((task) => task.status === "Anulowane").length,
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

      {isFormVisible && <TaskForm onAddTask={handleAddTask} />}

      {actionError && <div className="form-error">{actionError}</div>}

      <div className="task-filters">
        {taskFilters.map((filter) => (
          <button
            key={filter}
            className={
              activeFilter === filter ? "filter-button active" : "filter-button"
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
            <span>{taskFilterCounts[filter]}</span>
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
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
              onChangeStatus={handleChangeTaskStatus}
              onAddComment={handleAddTaskComment}
              onCancelTask={handleCancelTask}
            />
          ))}
        </div>
      )}
    </section>
  );
}

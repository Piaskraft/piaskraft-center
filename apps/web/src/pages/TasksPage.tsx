import { useState } from 'react';
import { TaskForm, type NewTaskData } from '../features/tasks/TaskForm';
import { tasks as initialTasks } from '../features/tasks/taskMockData';
import type { Task, TaskStatus } from '../features/tasks/taskTypes';

const taskStatuses: TaskStatus[] = [
  'Nowe',
  'Do zrobienia',
  'W trakcie',
  'Czeka na sprawdzenie',
  'Zrobione',
  'Anulowane',
];

type TaskFilter = 'Wszystkie' | 'Admin' | 'Operator' | 'Pilne' | 'Zrobione';

const taskFilters: TaskFilter[] = [
  'Wszystkie',
  'Admin',
  'Operator',
  'Pilne',
  'Zrobione',
];

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('Wszystkie');

  function handleAddTask(newTask: NewTaskData) {
    const today = new Date().toISOString().slice(0, 10);

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      category: newTask.category,
      priority: newTask.priority,
      status: 'Nowe',
      date: newTask.date,
      time: newTask.time,
      createdBy: 'Admin',
      createdAt: today,
      updatedAt: today,
    };

    setTasks((currentTasks) => [task, ...currentTasks]);
    setIsFormVisible(false);
  }

  function handleChangeTaskStatus(taskId: number, status: TaskStatus) {
    const today = new Date().toISOString().slice(0, 10);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              updatedAt: today,
            }
          : task,
      ),
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'Wszystkie') return true;
    if (activeFilter === 'Admin') return task.assignedTo === 'Admin';
    if (activeFilter === 'Operator') return task.assignedTo === 'Operator';
    if (activeFilter === 'Pilne') return task.priority === 'Pilny';
    if (activeFilter === 'Zrobione') return task.status === 'Zrobione';

    return true;
  });

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
          {isFormVisible ? 'Zamknij formularz' : 'Dodaj zadanie'}
        </button>
      </div>

      {isFormVisible && <TaskForm onAddTask={handleAddTask} />}

      <div className="task-filters">
        {taskFilters.map((filter) => (
          <button
            key={filter}
            className={
              activeFilter === filter ? 'filter-button active' : 'filter-button'
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="tasks-list">
        {filteredTasks.map((task) => (
          <article key={task.id} className="task-card">
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
                  handleChangeTaskStatus(task.id, event.target.value as TaskStatus)
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
        ))}
      </div>
    </section>
  );
}
import { useState } from 'react';
import { TaskCard } from '../features/tasks/TaskCard';
import { TaskForm, type NewTaskData } from '../features/tasks/TaskForm';
import { tasks as initialTasks } from '../features/tasks/taskMockData';
import {
  taskFilters,
  taskStatuses,
  type TaskFilter,
} from '../features/tasks/taskOptions';
import type { Task, TaskStatus } from '../features/tasks/taskTypes';

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
      comments: [],
      createdBy: 'Admin',
      createdAt: today,
      updatedAt: today,
    };

    setTasks((currentTasks) => [task, ...currentTasks]);
    setIsFormVisible(false);
  }

  function handleAddTaskComment(taskId: number, content: string) {
  const today = new Date().toISOString().slice(0, 10);

  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            comments: [
              ...task.comments,
              {
                id: Date.now(),
                author: 'Admin',
                content,
                createdAt: today,
              },
            ],
            updatedAt: today,
          }
        : task,
    ),
  );
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
  function handleCancelTask(taskId: number) {
  handleChangeTaskStatus(taskId, 'Anulowane');
}

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'Wszystkie') return true;
    if (activeFilter === 'Admin') return task.assignedTo === 'Admin';
   if (activeFilter === 'Operator') return task.assignedTo === 'Operator';
if (activeFilter === 'Oboje') return task.assignedTo === 'Oboje';
if (activeFilter === 'Pilne') return task.priority === 'Pilny';
    if (activeFilter === 'Zrobione') return task.status === 'Zrobione';

    return true;
  });

const taskFilterCounts: Record<TaskFilter, number> = {
  Wszystkie: tasks.length,
  Admin: tasks.filter((task) => task.assignedTo === 'Admin').length,
  Operator: tasks.filter((task) => task.assignedTo === 'Operator').length,
Oboje: tasks.filter((task) => task.assignedTo === 'Oboje').length,
Pilne: tasks.filter((task) => task.priority === 'Pilny').length,
  Zrobione: tasks.filter((task) => task.status === 'Zrobione').length,
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
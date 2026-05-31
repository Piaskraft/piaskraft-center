import { useState } from 'react';
import { TaskForm, type NewTaskData } from '../features/tasks/TaskForm';
import { tasks as initialTasks } from '../features/tasks/taskMockData';
import type { Task } from '../features/tasks/taskTypes';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isFormVisible, setIsFormVisible] = useState(false);

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

      <div className="tasks-list">
        {tasks.map((task) => (
          <article key={task.id} className="task-card">
            <div>
              <h3>{task.title}</h3>
              <p>
                {task.category} · {task.assignedTo}
              </p>
            </div>

            <div className="task-meta">
              <span>{task.priority}</span>
              <span>{task.status}</span>
              {task.date && <span>{task.date}</span>}
              {task.time && <span>{task.time}</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
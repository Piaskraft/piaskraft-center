import type {
  AssignedUser,
  TaskCategory,
  TaskPriority,
} from './taskTypes';

export type NewTaskData = {
  title: string;
  description: string;
  assignedTo: AssignedUser;
  category: TaskCategory;
  priority: TaskPriority;
  date: string;
  time?: string;
};

type TaskFormProps = {
  onAddTask: (task: NewTaskData) => void;
};

export function TaskForm({ onAddTask }: TaskFormProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get('title') || '').trim();

    if (!title) {
      alert('Wpisz tytuł zadania.');
      return;
    }

    onAddTask({
      title,
      description: String(formData.get('description') || '').trim(),
      assignedTo: formData.get('assignedTo') as AssignedUser,
      category: formData.get('category') as TaskCategory,
      priority: formData.get('priority') as TaskPriority,
      date: String(formData.get('date') || ''),
      time: String(formData.get('time') || ''),
    });

    event.currentTarget.reset();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Tytuł zadania
          <input
            name="title"
            type="text"
            placeholder="Np. Przygotować produkt do PrestaShop"
          />
        </label>

        <label>
          Przypisane do
          <select name="assignedTo" defaultValue="Operator">
            <option>Admin</option>
            <option>Operator</option>
          </select>
        </label>

        <label>
          Kategoria
          <select name="category" defaultValue="MJW">
            <option>Piaskraft</option>
            <option>PrestaShop</option>
            <option>eBay</option>
            <option>BaseLinker</option>
            <option>MJW</option>
            <option>Marketing</option>
            <option>Dokumenty</option>
            <option>Telefon</option>
            <option>Prywatne</option>
            <option>Inne</option>
          </select>
        </label>

        <label>
          Priorytet
          <select name="priority" defaultValue="Normalny">
            <option>Niski</option>
            <option>Normalny</option>
            <option>Ważny</option>
            <option>Pilny</option>
            <option>Dzisiaj</option>
          </select>
        </label>

        <label>
          Data
          <input name="date" type="date" />
        </label>

        <label>
          Godzina
          <input name="time" type="time" />
        </label>
      </div>

      <label>
        Opis
        <textarea
          name="description"
          placeholder="Krótki opis zadania..."
          rows={4}
        />
      </label>

      <div className="form-actions">
        <button type="reset" className="secondary-button">
          Anuluj
        </button>

        <button type="submit" className="primary-button">
          Zapisz zadanie
        </button>
      </div>
    </form>
  );
}
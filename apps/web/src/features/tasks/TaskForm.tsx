import { useState, type FormEvent } from "react";
import type { AssignedUser, TaskCategory, TaskPriority } from "./taskTypes";

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
  initialDate?: string;
};

export function TaskForm({ onAddTask, initialDate = "" }: TaskFormProps) {
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const title = String(formData.get("title") || "").trim();
    const date = String(formData.get("date") || "");

    if (!title) {
      setErrorMessage("Wpisz tytuł zadania.");
      return;
    }

    if (!date) {
      setErrorMessage("Wybierz datę wykonania zadania.");
      return;
    }

    const year = Number(date.slice(0, 4));

    if (year < 2026 || year > 2035) {
      setErrorMessage("Wybierz poprawną datę między 2026 a 2035 rokiem.");
      return;
    }

    onAddTask({
      title,
      description: String(formData.get("description") || "").trim(),
      assignedTo: formData.get("assignedTo") as AssignedUser,
      category: formData.get("category") as TaskCategory,
      priority: formData.get("priority") as TaskPriority,
      date,
      time: String(formData.get("time") || ""),
    });

    setErrorMessage("");
    event.currentTarget.reset();
  }

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      onReset={() => setErrorMessage("")}
    >
      {errorMessage && <div className="form-error">{errorMessage}</div>}

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
            <option>Oboje</option>
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
          <input name="date" type="date" defaultValue={initialDate} />
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

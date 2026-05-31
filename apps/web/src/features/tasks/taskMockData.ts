import type { Task } from './taskTypes';

export const tasks: Task[] = [
  {
    id: 1,
    title: 'Sprawdzić produkt testowy MJW',
    description: 'Operator sprawdza dane produktu i przygotowuje go do PrestaShop.',
    assignedTo: 'Operator',
    category: 'MJW',
    priority: 'Ważny',
    status: 'Do zrobienia',
    date: '2026-05-30',
    time: '18:00',
    createdBy: 'Admin',
    createdAt: '2026-05-30',
    updatedAt: '2026-05-30',
  },
  {
    id: 2,
    title: 'Przygotować ofertę testową eBay',
    description: 'Admin przygotowuje pierwszą ofertę testową pod BaseLinker/eBay.',
    assignedTo: 'Admin',
    category: 'eBay',
    priority: 'Normalny',
    status: 'W trakcie',
    date: '2026-05-31',
    time: '19:00',
    createdBy: 'Admin',
    createdAt: '2026-05-30',
    updatedAt: '2026-05-30',
  },
];
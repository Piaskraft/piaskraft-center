import type { TaskStatus } from './taskTypes';

export const taskStatuses: TaskStatus[] = [
  'Nowe',
  'Do zrobienia',
  'W trakcie',
  'Czeka na sprawdzenie',
  'Zrobione',
  'Anulowane',
];

export type TaskFilter =
  | 'Wszystkie'
  | 'Admin'
  | 'Operator'
  | 'Oboje'
  | 'Pilne'
  | 'Zrobione';

export const taskFilters: TaskFilter[] = [
  'Wszystkie',
  'Admin',
  'Operator',
  'Oboje',
  'Pilne',
  'Zrobione',
];
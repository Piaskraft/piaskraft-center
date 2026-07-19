import type {
  TaskAssignee,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from '../../generated/prisma/enums';

export class UpdateTaskDto {
  title?: string;
  description?: string;
  assignedTo?: TaskAssignee;
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
  date?: string | null;
  time?: string | null;
}

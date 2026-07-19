import type {
  TaskAssignee,
  TaskAuthor,
  TaskCategory,
  TaskPriority,
} from '../../generated/prisma/enums';

export class CreateTaskDto {
  title!: string;
  description!: string;
  assignedTo!: TaskAssignee;
  category!: TaskCategory;
  priority?: TaskPriority;
  date?: string;
  time?: string;
  createdBy!: TaskAuthor;
}

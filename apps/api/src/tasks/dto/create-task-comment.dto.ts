import type { TaskAuthor } from '../../generated/prisma/enums';

export class CreateTaskCommentDto {
  author!: TaskAuthor;
  content!: string;
}

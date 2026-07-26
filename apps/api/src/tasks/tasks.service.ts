import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTaskDto) {
    const notificationRecipient =
      data.createdBy === 'ADMIN' &&
      (data.assignedTo === 'OPERATOR' || data.assignedTo === 'BOTH')
        ? 'OPERATOR'
        : data.createdBy === 'OPERATOR' &&
            (data.assignedTo === 'ADMIN' || data.assignedTo === 'BOTH')
          ? 'ADMIN'
          : null;

    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        category: data.category,
        ...(data.priority ? { priority: data.priority } : {}),
        date: data.date ? new Date(`${data.date}T00:00:00.000Z`) : null,
        time: data.time ? new Date(`1970-01-01T${data.time}:00.000Z`) : null,
        createdBy: data.createdBy,
        ...(notificationRecipient
          ? {
              notifications: {
                create: {
                  type: 'TASK_CREATED',
                  recipient: notificationRecipient,
                  actor: data.createdBy,
                  title: 'Nowe zadanie',
                  message: `Przypisano Ci zadanie: ${data.title}`,
                },
              },
            }
          : {}),
      },
      include: {
        comments: true,
      },
    });
  }

  addComment(taskId: number, data: CreateTaskCommentDto) {
    return this.prisma.taskComment.create({
      data: {
        taskId,
        author: data.author,
        content: data.content,
      },
    });
  }

  async deleteComment(taskId: number, commentId: number) {
    const result = await this.prisma.taskComment.deleteMany({
      where: {
        id: commentId,
        taskId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Komentarz nie istnieje.');
    }

    return {
      success: true,
    };
  }

  update(taskId: number, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.assignedTo !== undefined
          ? { assignedTo: data.assignedTo }
          : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.priority !== undefined ? { priority: data.priority } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.date !== undefined
          ? {
              date: data.date ? new Date(`${data.date}T00:00:00.000Z`) : null,
            }
          : {}),
        ...(data.time !== undefined
          ? {
              time: data.time
                ? new Date(`1970-01-01T${data.time}:00.000Z`)
                : null,
            }
          : {}),
      },
      include: {
        comments: true,
      },
    });
  }

  async archive(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException('Zadanie nie istnieje.');
    }

    if (task.status !== 'DONE' && task.status !== 'CANCELLED') {
      throw new BadRequestException(
        'Do archiwum można przenieść tylko zadanie zrobione lub anulowane.',
      );
    }

    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        archivedAt: new Date(),
      },
      include: {
        comments: true,
      },
    });
  }
  async restore(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException('Zadanie nie istnieje.');
    }

    if (!task.archivedAt) {
      throw new BadRequestException('Zadanie nie znajduje się w archiwum.');
    }

    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        archivedAt: null,
      },
      include: {
        comments: true,
      },
    });
  }

  findAll() {
    return this.prisma.task.findMany({
      include: {
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

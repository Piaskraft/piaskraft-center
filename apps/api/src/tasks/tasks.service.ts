import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTaskDto) {
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

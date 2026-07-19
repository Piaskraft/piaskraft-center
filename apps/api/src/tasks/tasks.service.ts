import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

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

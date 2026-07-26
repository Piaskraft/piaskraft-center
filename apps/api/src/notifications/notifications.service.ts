import { Injectable } from '@nestjs/common';
import type { TaskAuthor } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(recipient: TaskAuthor) {
    return this.prisma.notification.findMany({
      where: {
        recipient,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

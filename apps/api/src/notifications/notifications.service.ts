import { Injectable, NotFoundException } from '@nestjs/common';
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

  async markAsRead(notificationId: number, recipient: TaskAuthor) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        recipient,
      },
      data: {
        isRead: true,
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Powiadomienie nie istnieje.');
    }

    return {
      success: true,
    };
  }
}

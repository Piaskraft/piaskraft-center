import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { TaskAuthor } from '../generated/prisma/enums';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @Query('recipient', new ParseEnumPipe(TaskAuthor))
    recipient: TaskAuthor,
  ) {
    return this.notificationsService.findAll(recipient);
  }

  @Patch(':notificationId/read')
  markAsRead(
    @Param('notificationId', ParseIntPipe) notificationId: number,
    @Query('recipient', new ParseEnumPipe(TaskAuthor))
    recipient: TaskAuthor,
  ) {
    return this.notificationsService.markAsRead(notificationId, recipient);
  }
}
